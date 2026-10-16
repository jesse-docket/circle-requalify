/* ===========================================================================
   Shared qualification model for the Circle re-qualification demo.
   Option strings are verbatim from circle.so/plus-sales (HubSpot portal 9306053).
   Field keys are verbatim HubSpot property names — these are exactly the keys
   passed to the agent, and exactly the DCI variable names on the agent.
   =========================================================================== */
window.CIRCLE = (function(){

  const FIELDS = {
    what_do_you_want_to_achieve_with_circle_: {
      label: 'What is your goal with Circle?',
      options: ['I want to start building','I want to move from another platform','Just exploring']
    },
    current_community_or_membership_size: {
      label: 'How many members do you have?',
      options: ['Over 5,000 members','Between 1,000 and 5,000 members','Between 100 and 1,000 members',
                'Between 1 and 100 members',"I don't have members yet"]
    },
    annual_revenue__range_: {
      label: 'What is your annual revenue across your entire business?',
      options: ['Over $10M/year','$1M - $10M/year','$250K - $1M/year','$100K - $250K/year',
                '$50K - $100K/year','Under $50K/year or no revenue']
    },
    part_of_a_team: {
      label: 'Are you part of a team?',
      options: ['Yes, have full-time teammates','Yes, have part-time help or contractors','No, just me for now']
    },
    desired_time_to_implement_community_product: {
      label: 'What is your implementation timeline?',
      options: ['Immediately','In a few months','Within a year','I don’t know, or beyond a year']
    }
  };

  /* $100K+ bands route to sales. The boundary falls cleanly between two bands. */
  const SALES_BANDS = ['Over $10M/year','$1M - $10M/year','$250K - $1M/year','$100K - $250K/year'];
  const routeFor = rev => SALES_BANDS.indexOf(rev) >= 0 ? 'sales' : 'trial';

  /* Plain-language fragments used to build Clara's opening line. */
  /* Plain-language clauses used to build Clara's opening line. */
  const INTENT_PHRASE = {
    'I want to start building'            : "you're building a community from scratch",
    'I want to move from another platform': "you're moving over from another platform",
    'Just exploring'                      : "you're still weighing up whether Circle is the right home"
  };
  const SIZE_PHRASE = {
    'Over 5,000 members'             : 'you have over 5,000 members',
    'Between 1,000 and 5,000 members': 'you have a few thousand members',
    'Between 100 and 1,000 members'  : 'you have a few hundred members',
    'Between 1 and 100 members'      : "you've got a small group so far",
    "I don't have members yet"       : "you don't have members yet"
  };
  const TIME_PHRASE = {
    'Immediately'    : 'you want to move right away',
    'In a few months': "you're looking at the next few months",
    'Within a year'  : "you're aiming for sometime this year"
  };
  TIME_PHRASE['I don\u2019t know, or beyond a year'] = "there's no fixed date yet";

  const PLAN_SUGGESTION = {
    'Over $10M/year'              : 'Circle Plus',
    '$1M - $10M/year'             : 'Scale',
    '$250K - $1M/year'            : 'Business',
    '$100K - $250K/year'          : 'Business',
    '$50K - $100K/year'           : 'Professional',
    'Under $50K/year or no revenue':'Professional'
  };

  const PLAN_PRICE = {
    'Professional':'$89/mo','Business':'$199/mo','Scale':'$419/mo','Circle Plus':'custom pricing'
  };

  const TRIAL_BASE = 'https://app.circle.so/communities/new';

  function trialLink(a){
    const p = new URLSearchParams({
      sales_utm_source:'allboundae',
      sales_utm_campaign:'ab10'
    });
    const plan = PLAN_SUGGESTION[a.annual_revenue__range_];
    if (plan && plan !== 'Circle Plus') p.set('plan', plan.toLowerCase());
    if (a.email) p.set('email', a.email);
    return TRIAL_BASE + '?' + p.toString();
  }

  /* The exact sentence Clara continues with after her fixed greeting. */
  function joinClauses(list){
    const c = list.filter(Boolean);
    if (c.length <= 1) return c[0] || '';
    return c.slice(0,-1).join(', ') + ', and ' + c[c.length-1];
  }

  function openingLine(a){
    const name  = (a.firstname || '').trim();
    const route = routeFor(a.annual_revenue__range_);
    const recap = joinClauses([
      INTENT_PHRASE[a.what_do_you_want_to_achieve_with_circle_],
      SIZE_PHRASE[a.current_community_or_membership_size],
      TIME_PHRASE[a.desired_time_to_implement_community_product]
    ]);
    const open = (name ? 'So ' + name + ' \u2014 ' : 'So \u2014 ') + (recap || 'tell me where you are today') + '.';

    if (route === 'sales'){
      if (a.what_do_you_want_to_achieve_with_circle_ === 'Just exploring'){
        return open + ' At your size that is a decision worth getting right, so tell me what you would want '
             + 'running on day one and I will tell you straight whether Circle is it.';
      }
      return open + ' That is exactly the kind of move our team handles every week \u2014 tell me what you are '
           + 'running on today and I will show you how it lands on Circle.';
    }
    return open + ' You can have that live today on a free trial, no card needed \u2014 want me to set it up '
         + 'and walk you through it?';
  }

  function context(a){
    const ctx = {};
    Object.keys(FIELDS).forEach(k => { if (a[k]) ctx[k] = a[k]; });
    ['firstname','lastname','email','plan_interest_survey_response'].forEach(k => { if (a[k]) ctx[k] = a[k]; });
    if (a.annual_revenue__range_){
      ctx.route      = routeFor(a.annual_revenue__range_);
      ctx.trial_link = trialLink(a);
    }
    if (Object.keys(ctx).length) ctx.opening_line = openingLine(a);
    ctx.demo_mode = 'true';
    return ctx;
  }

  function fromQuery(){
    const q = new URLSearchParams(location.search), a = {};
    ['firstname','lastname','email','plan_interest_survey_response',
     'how_did_you_hear_about_us_'].concat(Object.keys(FIELDS))
      .forEach(k => { const v = q.get(k); if (v) a[k] = v; });
    return a;
  }

  return { FIELDS, SALES_BANDS, PLAN_SUGGESTION, PLAN_PRICE,
           routeFor, trialLink, openingLine, context, fromQuery };
})();
