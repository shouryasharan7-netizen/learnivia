const { ROUTES } = require("../src/lib/routes.ts");

async function checkRoutes() {
  const routesToTest = [
    ROUTES.home,
    ROUTES.about,
    ROUTES.howItWorks,
    ROUTES.parents,
    ROUTES.educators,
    ROUTES.safety,
    ROUTES.safetyReport,
    ROUTES.faq,
    ROUTES.support,
    ROUTES.blog,
    ROUTES.stories,
    ROUTES.terms,
    ROUTES.privacy,
    ROUTES.cookies,
    ROUTES.resources,
    ROUTES.resourcesStudyGuides,
    ROUTES.resourcesTools,
    ROUTES.find,
    ROUTES.sessions,
    ROUTES.homeworkHelp,
    ROUTES.community,
    ROUTES.auth.signIn,
    ROUTES.auth.signUp,
    ROUTES.auth.forgotPassword,
  ];

  console.log(`Auditing ${routesToTest.length} primary routes on http://localhost:3000...`);
  let failures = 0;

  for (const route of routesToTest) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, { method: "HEAD" });
      // 200, 307 (redirect for auth), etc. are valid, but 404 or 500 is failure
      if (res.status === 404 || res.status >= 500) {
        console.error(`❌ Route ${route} returned HTTP ${res.status}`);
        failures++;
      } else {
        console.log(`✓ [${res.status}] ${route}`);
      }
    } catch (e) {
      console.error(`❌ Connection error for route ${route}:`, e.message);
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`Audit failed with ${failures} broken routes.`);
    process.exit(1);
  } else {
    console.log(`All ${routesToTest.length} tested routes returned valid HTTP responses!`);
  }
}

checkRoutes().catch((e) => {
  console.error(e);
  process.exit(1);
});
