/**
 * The tags each published post should carry, decided per post.
 *
 * Kept as data rather than derived by a rule, because it was not derived by a
 * rule: every line is a reading of what that post is actually about. The old
 * tags were whatever WordPress's autocomplete offered on the day — 261 of them
 * across 93 posts, 213 used exactly once, and tags like `nicer`, `better`,
 * `thought`, `home` and `join` that describe nothing anyone would search for.
 *
 * Three principles behind the vocabulary:
 *
 *   1. A tag is a landing page or it is noise. `/tags/php/` collecting eighteen
 *      posts is a page worth ranking. `/tags/nokia-e65/` holding one is a page
 *      that dilutes the site and gets noindexed by the three-post rule anyway.
 *   2. English throughout, even on the Spanish and Galician posts. The tag is a
 *      URL and a grouping key, not body copy, and `servidor-web` and
 *      `web-server` splitting one topic in two helps nobody.
 *   3. Terms people type. `macos`, not `leopard`. `caching`, not `cache` plus
 *      `caching` plus `memcache` plus `memcached`.
 *
 * On density: the vocabulary stays closed, but a post carries every tag in it
 * that genuinely applies rather than the first two that came to mind. A LAMP
 * tutorial is about apache and php and mysql and linux, and pretending it is
 * about only the first two costs `/tags/linux/` a post it should hold. The test
 * for adding a tag is whether somebody browsing that tag would be glad to find
 * this post — not whether the word appears in it. Deliberately not tagged:
 * `linux` on posts that merely run on it, `performance` on anything that is
 * only incidentally faster.
 */
export const ASSIGNMENTS = new Map([
	// --- PHP, the largest cluster in the archive -----------------------------
	["debugging-php-with-xdebug-and-komodo-ide", ["php", "debugging", "developer-tools"]],
	["easy-way-to-install-php-qa-tools", ["php", "testing", "developer-tools", "continuous-integration"]],
	["how-to-easily-create-debian-packages-for-php-extensions", ["php", "debian", "packaging", "linux"]],
	["indent-your-html-code-with-a-smarty-plugin", ["php", "html", "frontend"]],
	["pingback-php-a-library-for-performing-pingback-calls-in-an-easy-way", ["php", "open-source"]],
	["simplified-version-of-test-runner-for-php", ["php", "testing", "developer-tools"]],
	["sort-an-array-of-objects-by-one-of-the-object-property-with-php", ["php"]],
	["speed-up-php-linting-with-xargs", ["php", "continuous-integration", "performance", "terminal"]],
	["sql-injection-php-y-bases-de-datos", ["php", "security", "databases"]],
	["test-your-code-with-every-change-in-your-php-files", ["php", "testing", "developer-tools"]],
	["tips-de-seguridad-en-php", ["php", "security"]],
	["setting-up-jenkins-in-ubuntu-precise-12-04-for-php-projects", ["php", "continuous-integration", "testing", "ubuntu", "devops", "sysadmin"]],

	// --- Ruby and Rails -------------------------------------------------------
	["acceso-rapido-a-la-documentacion-de-tus-gemas-de-ruby", ["ruby", "terminal", "developer-tools"]],
	["autotest-con-advertencias-en-growl", ["ruby", "rails", "testing", "macos", "developer-tools"]],
	["benchmarks-de-ruby-19", ["ruby", "performance", "testing"]],
	["busqueda-en-rails-con-sphinx", ["rails", "ruby", "search", "performance"]],
	["de-symbian-mi-nokia-e65-y-ruby", ["ruby", "mobile"]],
	["graficas-estilo-keynote-con-ruby", ["ruby", "data-visualisation"]],
	["procesado-de-documentos-xml-con-ruby-i", ["ruby", "xml"]],
	["procesado-de-documentos-xml-con-ruby-ii", ["ruby", "xml"]],
	["pruebas-de-stress-en-apps-rails", ["rails", "ruby", "testing", "performance"]],
	["ruby-cookbook", ["ruby", "books"]],
	["ruby-y-google-pagerank", ["ruby", "seo"]],
	["configuracion-de-lighttpd-sobre-linux-con-php5-ruby-on-rails-y-ssl", ["web-servers", "php", "rails", "security", "linux", "sysadmin"]],

	// --- Linux and system administration --------------------------------------
	["authenticate-into-ubuntu-12-04-with-your-dni-e-spanish-id", ["ubuntu", "linux", "security", "sysadmin"]],
	["automatic-upgrades-on-ubuntu-with-apt-and-cron", ["ubuntu", "debian", "linux", "sysadmin"]],
	["block-grub2-entries-with-userpass-auth", ["linux", "security", "sysadmin"]],
	["busqueda-avanzada-de-archivos-con-find-locate-y-grep", ["linux", "terminal", "sysadmin"]],
	["cocinando-el-kernel-linux-para-macbook-core-2-duo", ["linux", "macos", "hardware"]],
	["compartir-si-pero-con-seguridad", ["linux", "security", "sysadmin"]],
	["get-back-disk-space-in-debian-based-linux", ["debian", "linux", "sysadmin"]],
	["get-better-performance-and-life-from-your-ssd-in-linux-based-systems", ["linux", "performance", "hardware"]],
	["install-ubuntu-karmic-koala-on-a-macbook", ["ubuntu", "linux", "macos", "hardware"]],
	["joining-ubuntu-lucid-lynx-to-active-directory", ["ubuntu", "linux", "sysadmin", "security"]],
	["macbook-pro-keyboard-backlight-keys-on-ubuntu-gnulinux", ["ubuntu", "linux", "macos", "hardware"]],
	["playing-with-d-bus-interface-of-spotify-for-linux", ["linux", "scripting", "developer-tools"]],
	["remove-grub-from-mbr-under-mac-os-x", ["macos", "linux", "sysadmin"]],
	["speed-up-archlinux-aur-builds", ["linux", "packaging", "performance"]],
	["trucos-con-ssh", ["linux", "ssh", "terminal", "sysadmin"]],
	["wireless-atheros-del-macbook-en-gnulinux", ["linux", "macos", "hardware"]],
	["improve-munin-stats-page-with-new-layout-and-plugins", ["sysadmin", "monitoring", "linux", "performance"]],

	// --- Web servers and caching ----------------------------------------------
	["servidor-optimizado-con-nginx-y-memcached", ["nginx", "caching", "performance", "web-servers", "linux"]],
	["configuracion-de-virtualhosts-en-nginx-con-php-5-nginx-ii", ["nginx", "php", "web-servers", "sysadmin"]],
	["configuracin-de-php-5-en-nginx-nginx-iii", ["nginx", "php", "web-servers", "sysadmin"]],
	["drupal-lighttpd-url-limpias", ["web-servers", "php", "sysadmin"]],
	["how-to-setup-a-lamp-server-with-less-than-100-characters", ["apache", "php", "mysql", "sysadmin", "linux", "web-servers", "databases"]],
	["show-nicer-file-listings-with-apache-autoindex-module", ["apache", "sysadmin", "web-servers"]],
	["using-memcache-server-as-apache-content-cach", ["apache", "caching", "performance", "web-servers"]],
	["3-ways-of-get-memcached-status", ["caching", "sysadmin", "monitoring"]],
	["solving-caching-issues-with-vagrant-on-vboxsf", ["caching", "devops", "developer-tools"]],
	["speed-up-google-analytics-js-by-caching-it-locally", ["performance", "javascript", "caching", "frontend"]],
	["scale-out-vs-scale-up", ["architecture", "performance", "sysadmin", "databases"]],

	// --- Databases -------------------------------------------------------------
	["configuracion-de-mysql-para-rendimiento-2", ["mysql", "databases", "performance", "sysadmin"]],
	["optimizing-mysql-databases", ["mysql", "databases", "performance", "sysadmin"]],
	["migracion-de-datos-de-sqlite3-a-mysql", ["mysql", "databases"]],
	["migraciones-en-mysql-y-caracteres-especiales", ["mysql", "databases", "rails"]],
	["script-de-correccion-de-charsets-utf-8-mal-exportados", ["databases", "mysql", "scripting", "terminal"]],
	["install-oracle-database-xe-on-apple-sillicon", ["databases", "docker", "macos", "developer-tools"]],

	// --- Git --------------------------------------------------------------------
	["control-de-versiones-con-git-i", ["git", "developer-tools"]],
	["gestion-de-branches-y-tags-con-git-ii", ["git", "developer-tools"]],
	["migrate-subversion-repository-to-git-without-loosing-data", ["git", "developer-tools"]],
	["restore-files-and-dir-from-previous-commits-in-git", ["git", "developer-tools"]],
	["sending-patches-to-your-coworkers-through-mail-with-git-send-mail", ["git", "email"]],
	["setup-a-remote-git-repository-using-http-with-push-support-and-digest-auth", ["git", "sysadmin", "web-servers"]],

	// --- AI, agents and the current work ----------------------------------------
	["using-code-agents", ["ai", "agents", "claude-code", "developer-tools", "productivity"]],
	["my-personal-skills-for-ai-assisted-development", ["ai", "agents", "react", "threejs", "developer-tools"]],
	["genai-and-technical-tests-revolution-or-trap", ["ai", "career", "hiring"]],

	// --- This site: frontend, performance, SEO -----------------------------------
	["zero-javascript-frontend-rebuild", ["astro", "web-performance", "javascript", "css", "frontend"]],
	["astro-5-to-7-tailwind-3-to-4", ["astro", "css", "javascript", "developer-tools", "frontend"]],
	["forty-three-percent-not-an-article", ["seo", "content", "astro", "architecture"]],
	["rotar-imagenes-y-elementos-solo-con-css-2", ["css", "frontend", "javascript", "html"]],
	["microformateando-en-la-web-30", ["frontend", "html", "seo"]],
	["some-valuable-user-interface-patterns-resources", ["frontend", "design", "ux", "books"]],

	// --- Craft, career and leadership ---------------------------------------------
	["5-must-read-books-for-web-developers-and-architects", ["books", "career", "architecture", "software-engineering"]],
	["5-years-working-at-openhost-from-craftsmanship-to-enterprisy", ["career", "leadership"]],
	["lead-development-team-without-losing-technical-edge", ["leadership", "career", "software-engineering", "clean-code"]],
	["lessons-learned-in-development-mistakes-and-sucesses", ["career", "software-engineering", "leadership", "clean-code"]],
	["object-calisthenics-write-better-object-oriented-code", ["software-engineering", "clean-code"]],
	["thoughts-on-working-from-home", ["career", "remote-work", "productivity"]],
	["jerarquia-de-la-programacion", ["programming-culture"]],

	// --- GNOME, free software, Galician localisation -------------------------------
	["feelings-at-guadec-es-7-a-coruna", ["gnome", "open-source", "conferences"]],
	["gnome-launch-party-en-galiza-espana", ["gnome", "open-source", "galician"]],
	["complementos-terminoloxicos-galegos-para-fantasdic", ["galician", "l10n", "gnome", "ruby", "open-source"]],
	["slides-of-our-last-lecture-at-the-university-of-coruna", ["galician", "l10n", "open-source"]],

	// --- Tools, hardware and the rest -----------------------------------------------
	["dokku-create-your-own-paas", ["docker", "devops", "sysadmin"]],
	["how-to-build-a-split-keyboard-lily58-pro", ["hardware", "keyboards", "diy"]],
	["review-de-mac-os-leopard", ["macos"]],
	["textmate-mejor-editor", ["macos", "developer-tools"]],
	["setting-up-hubot-with-a-gtalk-account-for-fun", ["developer-tools", "automation"]],
	["thoughts-about-our-privacy-in-social-networks", ["privacy"]],
	["20-razones-o-mas-por-las-que-pasarte-a-gmail", ["email", "productivity"]],

	// --- Not technical posts. Tagged honestly rather than forced into a cluster ------
	["camino-de-las-estrellas", ["science"]],
	["japon", ["travel"]],
]);
