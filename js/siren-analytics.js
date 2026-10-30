/* SIREN website tracking. No telemetry before consent. No private URL parameters. */
(function () {
  'use strict';
  if (window.__sirenAnalyticsInstalled) return;
  window.__sirenAnalyticsInstalled = true;
  const KEY = 'blackraven.website.analytics.v1';
  const production = ['blackravenai.com', 'www.blackravenai.com'].includes(location.hostname);
  let consent = false, ready = false, started = false;
  try { consent = localStorage.getItem(KEY) === 'yes'; } catch (_) {}
  const params = new URLSearchParams(location.search);
  const tags = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const value = params.get(key);
    if (value && /^[a-zA-Z0-9_.-]{1,100}$/.test(value)) tags[key] = value;
  }
  const match = location.pathname.match(/^\/apps\/([a-z0-9-]+)(?:\/|$)/);
  const slug = match ? match[1] : 'studio';
  const app = ({'stop-brain-rot': 'stopbrainrot', volta: 'circuit-quest'})[slug] || slug;
  function start() {
    if (!consent || !production) return;
    if (started) { if (ready) window.posthog.opt_in_capturing({captureEventName: false}); return; }
    started = true;
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_in_capturing opt_out_capturing has_opted_out_capturing get_distinct_id reset set_config".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init('phc_w6LAbtiDaGJmZytMowhWTMkJNtMSEaWPGb5NdWthS92i', {
      api_host: 'https://us.i.posthog.com', persistence: 'memory',
      autocapture: false, capture_pageview: false, capture_pageleave: false,
      person_profiles: 'identified_only', disable_session_recording: true,
      disable_surveys: true, capture_performance: false, capture_exceptions: false,
      advanced_disable_flags: true, ip: false, save_referrer: false, save_campaign_params: false,
      before_send: function (event) {
        if (!consent || !event) return null;
        for (const key of Object.keys(event.properties)) {
          if (/url|referrer|initial|title/i.test(key) || key === '$set' || key === '$set_once') delete event.properties[key];
        }
        event.properties.$current_url = location.origin + location.pathname;
        event.properties.$geoip_disable = true;
        return event;
      },
      loaded: function (sdk) {
        ready = true;
        if (!consent) { sdk.opt_out_capturing(); return; }
        sdk.opt_in_capturing({captureEventName: false});
        sdk.register({app: app, platform: 'web'});
        sdk.capture('$pageview', tags);
      }
    });
  }
  function choose(on) {
    consent = on;
    try { localStorage.setItem(KEY, on ? 'yes' : 'no'); } catch (_) {}
    if (on) start();
    else if (ready) window.posthog.opt_out_capturing();
  }
  function choices() {
    if (document.getElementById('analytics-choice')) return;
    const box = document.createElement('dialog');
    box.id = 'analytics-choice'; box.setAttribute('aria-label', 'Optional website analytics');
    box.style.cssText = 'position:fixed;inset:0;margin:auto;max-width:420px;width:calc(100% - 40px);background:#15212b;color:white;border:1px solid #91a8bb;border-radius:16px;padding:24px;font:16px/1.5 system-ui;box-shadow:0 0 0 100vmax #0009;z-index:2147483647';
    box.innerHTML = '<h2 style="font:600 22px system-ui">Help improve our website?</h2><p>Allow anonymous page visits and app-store clicks through PostHog so we can understand which campaigns work. No form contents or recordings are collected.</p><p>Optional. Change your choice using Analytics choices in the footer.</p>';
    const finish = on => { choose(on); box.close(); box.remove(); };
    for (const [label,on] of [['Allow analytics',true],['Keep analytics off',false]]) {
      const button = document.createElement('button');button.type='button';button.textContent=label;
      button.style.cssText='display:block;width:100%;padding:12px;margin-top:12px;background:#203747;color:white;border:1px solid #91a8bb;border-radius:8px;font:inherit';
      button.onclick=()=>finish(on);box.append(button);
    }
    box.addEventListener('cancel',e=>{e.preventDefault();finish(false);});
    document.body.append(box);box.showModal();
  }
  const control=document.createElement('button');control.type='button';control.textContent='Analytics choices';
  control.style.cssText='font:inherit;color:inherit;background:transparent;border:0;text-decoration:underline;padding:12px;cursor:pointer';
  control.onclick=choices;
  (document.querySelector('.footer-bottom') || document.querySelector('footer') || document.body).append(control);
  let decided = false;
  try { decided = localStorage.getItem(KEY) !== null; } catch (_) {}
  if (consent) start(); else if (!decided && production) choices();
  document.addEventListener('click', function (event) {
    const anchor=event.target?.closest?.('a[href]'); if (!anchor) return;
    let url;try {url=new URL(anchor.href);}catch(_){return;}
    const store=url.hostname==='apps.apple.com'?'app_store':url.hostname==='play.google.com'?'google_play':null;
    if (!store) return;
    if (store==='google_play' && tags.utm_campaign) {
      url.searchParams.set('referrer',new URLSearchParams(tags).toString());anchor.href=url.toString();
    }
    if (ready && consent) window.posthog.capture('store_click',Object.assign({store:store},tags),{transport:'sendBeacon'});
  },true);
})();
