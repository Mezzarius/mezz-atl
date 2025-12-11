/* =======================================================
 *  Mezz Active Lighting (ATL Rewrite for Foundry v13)
 *  Author: Mezz
 * ======================================================= */

const MODULE_ID = "mezz-atl";

/* ----------------------------------------------- */
/*  Token Flag Helpers                             */
/* ----------------------------------------------- */

function getLightingFlag(token) {
    return token.document.getFlag(MODULE_ID, "activeLighting") ?? false;
}

async function setLightingFlag(token, value) {
    return token.document.setFlag(MODULE_ID, "activeLighting", value);
}

/* ----------------------------------------------- */
/*  Scene Control Button (Lighting Toggle UI)      */
/* ----------------------------------------------- */

Hooks.on("getSceneControlButtons", (controls) => {
    if (!Array.isArray(controls)) return;

    const tokenControls = controls.find(c => c.name === "token");
    if (!tokenControls) return;

    tokenControls.tools.push({
        name: "activeLighting",
        title: "Active Token Lighting",
        icon: "fas fa-lightbulb",
        button: true,
        visible: true,
        onClick: () => {
            ui.notifications.info("Select a token, then use its HUD to toggle lighting.");
        }
    });
});

/* ----------------------------------------------- */
/*  Token HUD Button                               */
/* ----------------------------------------------- */

Hooks.on("renderTokenHUD", (hud, html, data) => {
    const isOn = getLightingFlag(hud.token);

    const btn = $(`
        <div class="control-icon mezz-atl-hud" title="Toggle Active Lighting">
            <i class="fas fa-lightbulb ${isOn ? "on" : "off"}"></i>
        </div>
    `);

    btn.click(async () => {
        const newVal = !getLightingFlag(hud.token);
        await setLightingFlag(hud.token, newVal);

        btn.find("i")
            .toggleClass("on", newVal)
            .toggleClass("off", !newVal);

        applyActiveLighting(hud.token);

        ui.notifications.info(`Active Lighting: ${newVal ? "ON" : "OFF"}`);
    });

    html.find(".right").append(btn);
});

/* ----------------------------------------------- */
/*  Apply or Remove Lighting Effects               */
/* ----------------------------------------------- */

function applyActiveLighting(token) {
    const isOn = getLightingFlag(token);

    if (isOn) {
        token.document.update({
            "light": {
                dim: 20,
                bright: 10,
                angle: 360,
                alpha: 0.5,
                color: "#ffaa00",
                coloration: 1,
                luminosity: 0.5,
                attenuation: 0.2
            }
        });
    } else {
        token.document.update({
            "light": {
                dim: 0,
                bright: 0,
                color: null
            }
        });
    }
}

Hooks.on("updateToken", (doc, changes, options, userId) => {
    const token = canvas.tokens.get(doc.id);
    if (!token) return;

    if (changes.flags?.[MODULE_ID]?.activeLighting !== undefined) {
        applyActiveLighting(token);
    }
});

Hooks.on("canvasReady", () => {
    canvas.tokens.placeables.forEach(t => applyActiveLighting(t));
});
