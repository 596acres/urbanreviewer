let plans = [];
let lots = {};
let previousFilters = {};

async function loadPlans(success) {
    const r = await fetch('static/plans.json');
    return await r.json();
}

async function loadAllLots(success) {
    const r = await fetch('static/lots.json');
    return await r.json();
}

function getPlanLots(planName) {
    return lots.features.filter(f => f.properties.plan_name === planName);
}

module.exports = {
    init: async function () {
        plans = (await loadPlans());
        plans = plans.map(p => ({
            ...p,
            adopted: p.adopted ? p.adopted.split('-')[0] : null,
            updated: p.updated ? p.updated.split('-')[0] : null,
        }));
        lots = (await loadAllLots());
        lots.features = lots.features.map(l => {
            const plan = plans.find(p => p.cartodb_id === l.properties.plan_id);
            return {
                ...l,
                properties: {
                    ...l.properties,
                    borough: plan ? plan.borough : null,
                    plan_name: plan ? plan.name : null,
                },
            };
        });
    },

    getLots: function () {
        return lots;
    },

    getPlanLots,

    getPlan(planName) {
        const plan = plans.find(p => p.name === planName);
        if (plan) {
            plan.last_updated = plan.updated;
        }
        return plan;
    },

    getPlans: function (filters, extend) {
        let f = { ...filters };
        if (extend === undefined || extend) {
            f = { ...previousFilters, ...f };
        }

        const planMatches = (p) => {
            return (
                (!f.active || p.status === 'active') &&
                (!f.expired || p.status === 'expired') &&
                (!f.start || p.adopted >= '' + f.start) &&
                (!f.end || p.adopted <= '' + f.end) &&
                (!f.lastUpdatedMin || p.updated >= '' + f.lastUpdatedMin) &&
                (!f.lastUpdatedMax || p.updated < '' + f.lastUpdatedMax)
            );
        };

        previousFilters = f;
        return plans.filter(planMatches).toSorted((a, b) => a.name.localeCompare(b.name));
    },

    getNames: function (filters) {
        return this.getPlans(filters).map(p => p.name);
    },
};
