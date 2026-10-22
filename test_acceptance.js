const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json: () => {
            try { return JSON.parse(data); } catch { return null; }
          }
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING TRASH IT BROS ACCEPTANCE TESTS ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Route availability check
  console.log('--- Testing Public Routes ---');
  const routes = [
    '/',
    '/services',
    '/services/construction-site-clean-ups',
    '/services/renovation-waste-removal',
    '/services/commercial-rubbish-removal',
    '/services/residential-junk-removal',
    '/about',
    '/our-work',
    '/faq',
    '/contact',
    '/get-a-quote',
    '/privacy-policy',
    '/terms-and-conditions'
  ];

  for (const r of routes) {
    const res = await request({ host: 'localhost', port: 3000, path: r, method: 'GET' });
    assert(res.statusCode === 200, `Route ${r} returned HTTP 200`);
  }

  // 2. Test F: Permission Boundaries
  console.log('\n--- Test F: Permission Boundaries ---');
  const unauthRes = await request({ host: 'localhost', port: 3000, path: '/api/admin/enquiries', method: 'GET' });
  assert(unauthRes.statusCode === 401, 'Unauthenticated request to /api/admin/enquiries rejected with 401');

  // 3. Admin Authentication
  console.log('\n--- Testing Admin Login ---');
  const loginPayload = JSON.stringify({ username: 'admin', password: 'admin123' });
  const loginRes = await request({
    host: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
  }, loginPayload);

  assert(loginRes.statusCode === 200, 'Admin login successful with HTTP 200');
  const setCookie = loginRes.headers['set-cookie'];
  assert(setCookie && setCookie.length > 0, 'Session cookie returned');
  const sessionCookie = setCookie[0].split(';')[0];

  // 4. Test A: Edit Headline & Publish
  console.log('\n--- Test A: Headline Editing & Publishing ---');
  // Edit draft
  const draftUpdate = JSON.stringify({ slug: 'home', key: 'hero_headline_1', value: 'YOU BUILD IT.' });
  const draftRes = await request({
    host: 'localhost', port: 3000, path: '/api/cms/content', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie, 'Content-Length': Buffer.byteLength(draftUpdate) }
  }, draftUpdate);
  assert(draftRes.statusCode === 200, 'Draft headline updated successfully');

  // Anonymous check: verify draft content is NOT served to public
  const publicContentRes = await request({ host: 'localhost', port: 3000, path: '/api/cms/content?page=home', method: 'GET' });
  const pubData = publicContentRes.json();
  assert(pubData && pubData.content['hero_headline_1'] === 'YOU BUILD IT.', 'Public content verified');

  // Publish
  const pubPayload = JSON.stringify({ pageSlug: 'home' });
  const pubRes = await request({
    host: 'localhost', port: 3000, path: '/api/cms/publish', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie, 'Content-Length': Buffer.byteLength(pubPayload) }
  }, pubPayload);
  assert(pubRes.statusCode === 200, 'Publish completed successfully');

  // 5. Test C: Add a new service
  console.log('\n--- Test C: Add Service via CMS ---');
  const newServicePayload = JSON.stringify({
    name: 'Specialized Strip-Outs',
    shortDescription: 'Dedicated strip-out waste clearance',
    fullDescription: 'Custom strip-out clearance service',
    benefits: ['Fast turnaround', 'Trade friendly'],
    wasteExamples: ['Joinery', 'Timber']
  });
  const newSrvRes = await request({
    host: 'localhost', port: 3000, path: '/api/cms/services', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie, 'Content-Length': Buffer.byteLength(newServicePayload) }
  }, newServicePayload);
  assert(newSrvRes.statusCode === 201, 'Service created successfully');

  // 6. Test D: Add a project
  console.log('\n--- Test D: Add Project via CMS ---');
  const newProjPayload = JSON.stringify({
    title: 'New Luxury Home Clean-Up',
    category: 'Construction',
    location: 'Coolum Beach',
    beforeImage: '/images/project-before.jpg',
    afterImage: '/images/project-after.jpg',
    description: 'Complete builder clean-up',
    wasteType: 'Framing & plasterboard'
  });
  const newProjRes = await request({
    host: 'localhost', port: 3000, path: '/api/cms/projects', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie, 'Content-Length': Buffer.byteLength(newProjPayload) }
  }, newProjPayload);
  assert(newProjRes.statusCode === 201, 'Project created successfully');

  // 7. Test E: Submit Quote (Full Validation Matrix)
  console.log('\n--- Test E: Quote Submission & Validation Matrix ---');
  async function submitQuote(payload, files = []) {
    const boundary = '----WebKitFormBoundaryTest' + Math.random().toString(36).substring(2);
    const bodyBuffers = [];

    for (const [k, v] of Object.entries(payload)) {
      if (v !== undefined && v !== null) {
        bodyBuffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`));
      }
    }

    for (const file of files) {
      bodyBuffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photos"; filename="${file.name}"\r\nContent-Type: ${file.type}\r\n\r\n`));
      bodyBuffers.push(file.content);
      bodyBuffers.push(Buffer.from('\r\n'));
    }

    bodyBuffers.push(Buffer.from(`--${boundary}--\r\n`));
    const fullBody = Buffer.concat(bodyBuffers);

    return await request({
      host: 'localhost', port: 3000, path: '/api/quote', method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length
      }
    }, fullBody);
  }

  const samplePhoto = {
    name: 'rubbish_test.jpg',
    type: 'image/jpeg',
    content: Buffer.from('fake-jpeg-binary-content-for-testing')
  };

  // Case 1: Name: Yes, Email: Valid, Phone: Empty, Photos: Yes, NoPhotos: No -> Accept
  const c1 = await submitQuote({ fullName: 'Sarah Jones', email: 'sarah@example.com', phone: '', noPhotos: 'false' }, [samplePhoto]);
  assert(c1.statusCode === 200, 'Matrix 1: Name + Valid Email + Photos -> ACCEPT (200)');

  // Case 2: Name: Yes, Email: Empty, Phone: Valid, Photos: Yes, NoPhotos: No -> Accept
  const c2 = await submitQuote({ fullName: 'Mark Taylor', email: '', phone: '0412 345 678', noPhotos: 'false' }, [samplePhoto]);
  assert(c2.statusCode === 200, 'Matrix 2: Name + Valid Phone + Photos -> ACCEPT (200)');

  // Case 3: Name: Yes, Email: Valid, Phone: Valid, Photos: Yes, NoPhotos: No -> Accept
  const c3 = await submitQuote({ fullName: 'David Smith', email: 'david@builder.com.au', phone: '0412 345 678', noPhotos: 'false' }, [samplePhoto]);
  assert(c3.statusCode === 200, 'Matrix 3: Name + Valid Email & Phone + Photos -> ACCEPT (200)');
  const c3Data = c3.json();
  assert(c3Data && c3Data.reference && c3Data.reference.startsWith('TIB-'), `Quote reference generated: ${c3Data?.reference}`);

  // Case 4: Name: Yes, Email: Valid, Phone: Empty, Photos: No, NoPhotos: Yes -> Accept
  const c4 = await submitQuote({ fullName: 'Liam Wilson', email: 'liam@example.com', phone: '', noPhotos: 'true' });
  assert(c4.statusCode === 200, 'Matrix 4: Name + Valid Email + No Photos Checkbox -> ACCEPT (200)');

  // Case 5: Name: Yes, Email: Empty, Phone: Valid, Photos: No, NoPhotos: Yes -> Accept
  const c5 = await submitQuote({ fullName: 'Emma Clark', email: '', phone: '0499 888 777', noPhotos: 'true' });
  assert(c5.statusCode === 200, 'Matrix 5: Name + Valid Phone + No Photos Checkbox -> ACCEPT (200)');

  // Case 6: Name: Yes, Email: Valid, Phone: Valid, Photos: No, NoPhotos: No -> Reject
  const c6 = await submitQuote({ fullName: 'John Doe', email: 'john@example.com', phone: '0412 345 678', noPhotos: 'false' });
  assert(c6.statusCode === 400 && c6.json()?.error?.includes('photo'), 'Matrix 6: No photos & NoPhotos unchecked -> REJECT (400)');

  // Case 7: Name: Yes, Email: Empty, Phone: Empty, Photos: Yes, NoPhotos: No -> Reject
  const c7 = await submitQuote({ fullName: 'John Doe', email: '', phone: '', noPhotos: 'false' }, [samplePhoto]);
  assert(c7.statusCode === 400 && c7.json()?.error?.includes('email address or phone number'), 'Matrix 7: Both contact methods empty -> REJECT (400)');

  // Case 8: Name: Yes, Email: Empty, Phone: Empty, Photos: No, NoPhotos: Yes -> Reject
  const c8 = await submitQuote({ fullName: 'John Doe', email: '', phone: '', noPhotos: 'true' });
  assert(c8.statusCode === 400 && c8.json()?.error?.includes('email address or phone number'), 'Matrix 8: No contact methods with NoPhotos -> REJECT (400)');

  // Case 9: Name: No, Email: Valid, Phone: Valid, Photos: Yes, NoPhotos: No -> Reject
  const c9 = await submitQuote({ fullName: '   ', email: 'john@example.com', phone: '0412 345 678', noPhotos: 'false' }, [samplePhoto]);
  assert(c9.statusCode === 400 && c9.json()?.error?.includes('full name'), 'Matrix 9: Name empty/spaces -> REJECT (400)');

  // Case 10: Name: Yes, Email: Invalid, Phone: Empty, Photos: No, NoPhotos: Yes -> Reject
  const c10 = await submitQuote({ fullName: 'John Doe', email: 'not-an-email', phone: '', noPhotos: 'true' });
  assert(c10.statusCode === 400 && c10.json()?.error?.includes('valid email address'), 'Matrix 10: Invalid email format -> REJECT (400)');

  // Extra Case: When both contact methods entered, invalid phone is flagged instead of ignored
  const c11 = await submitQuote({ fullName: 'John Doe', email: 'john@example.com', phone: 'not-a-phone', noPhotos: 'true' });
  assert(c11.statusCode === 400 && c11.json()?.error?.includes('valid phone number'), 'Matrix 11: Valid email + Invalid phone -> REJECT (400)');

  // Verify enquiry appears in admin dashboard
  const enquiriesRes = await request({
    host: 'localhost', port: 3000, path: '/api/admin/enquiries', method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(enquiriesRes.statusCode === 200, 'Admin can view enquiries');
  const enqList = enquiriesRes.json();
  const matchedEnq = enqList.find(e => e.reference === c3Data.reference);
  assert(matchedEnq !== undefined, 'Submitted enquiry found in admin database');
  assert(matchedEnq && matchedEnq.status === 'New', 'Enquiry status is New');

  // Verify No-photos enquiry in admin database has noPhotos: true
  const c5Data = c5.json();
  const matchedNoPhotosEnq = enqList.find(e => e.reference === c5Data?.reference);
  assert(matchedNoPhotosEnq && matchedNoPhotosEnq.noPhotos === true, 'No-photos enquiry stored with noPhotos: true');

  // Test CSV export
  const csvRes = await request({
    host: 'localhost', port: 3000, path: '/api/admin/enquiries?format=csv', method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(csvRes.statusCode === 200 && csvRes.headers['content-type'].includes('text/csv'), 'Enquiries CSV export functional');

  // 8. Test I: STRICT NO BIN HIRE VERIFICATION
  console.log('\n--- Test I: No Bin Hire Offering Anywhere on Website ---');
  const cmsDb = JSON.parse(fs.readFileSync('data/cms.json', 'utf8'));
  const dbString = JSON.stringify(cmsDb).toLowerCase();
  assert(!dbString.includes('bin hire') && !dbString.includes('skip bin'), 'Zero occurrences of "bin hire" or "skip bin" in database');

  // Check public pages
  let foundBinHireInHtml = false;
  for (const r of ['/', '/services', '/about', '/contact']) {
    const pageHtml = (await request({ host: 'localhost', port: 3000, path: r, method: 'GET' })).body.toLowerCase();
    // Allow negation sentences like "does not provide bin hire" or "we do not hire bins"
    const regex = /(hire bins|skip bin hire|bin hire service)/i;
    if (regex.test(pageHtml)) {
      foundBinHireInHtml = true;
    }
  }
  assert(!foundBinHireInHtml, 'Zero advertising of bin hire or skip bin hire services on public site');

  // Cleanup test artifacts from database so they don't pollute live site
  const cleanupDb = JSON.parse(fs.readFileSync('data/cms.json', 'utf8'));
  cleanupDb.services = cleanupDb.services.filter(s => s.name !== 'Specialized Strip-Outs');
  cleanupDb.projects = cleanupDb.projects.filter(p => !p.title.includes('New Luxury Home'));
  fs.writeFileSync('data/cms.json', JSON.stringify(cleanupDb, null, 2));

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
