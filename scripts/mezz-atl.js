/* =======================================================
 *  Mezz Active Lighting (Inventory-Driven, About Time)
 *  Author: Mezz
 *  Version: 1.0.0
 * ======================================================= */

const MODULE_ID = "mezz-atl";
const LIGHT_EFFECT_ICON = "icons/sundries/lights/lantern-steel-yellow.webp";

/* ----------------------------------------------- */
/*  LIGHT PRESETS                                  */
/*  - Each has burnTimeMinutes (null = infinite)   */
/* ----------------------------------------------- */

const LIGHT_PRESETS = {
  torch: {
    label: "Torch",
    dim: 40,
    bright: 20,
    color: "#ffddaa",
    alpha: 0.5,
    angle: 360,
    luminosity: 0.5,
    coloration: 1,
    attenuation: 0.25,
    burnTimeMinutes: 60,
    consumable: true,
    itemName: "Torch"
  },
  candle: {
    label: "Candle",
    dim: 10,
    bright: 5,
    color: "#ffe4b5",
    alpha: 0.4,
    angle: 360,
    luminosity: 0.4,
    coloration: 1,
    attenuation: 0.3,
    burnTimeMinutes: 60,
    consumable: true,
    itemName: "Candle"
  },
  lamp: {
    label: "Lamp",
    dim: 45,
    bright: 15,
    color: "#fff2c2",
    alpha: 0.5,
    angle: 360,
    luminosity: 0.5,
    coloration: 1,
    attenuation: 0.25,
    burnTimeMinutes: 60,
    consumable: false,
    itemName: "Lamp"
  },
  hoodedLantern: {
    label: "Hooded Lantern",
    dim: 60,
    bright: 30,
    color: "#fff2bf",
    alpha: 0.55,
    angle: 360,
    luminosity: 0.55,
    coloration: 1,
    attenuation: 0.2,
    burnTimeMinutes: 360,
    consumable: false,
    itemName: "Hooded Lantern"
  },
  bullseyeLantern: {
    label: "Bullseye Lantern",
    dim: 120,
    bright: 60,
    color: "#fff8d1",
    alpha: 0.6,
    angle: 60,
    luminosity: 0.6,
    coloration: 1,
    attenuation: 0.2,
    burnTimeMinutes: 360,
    consumable: false,
    itemName: "Bullseye Lantern"
  },
  sunrod: {
    label: "Sunrod",
    dim: 60,
    bright: 30,
    color: "#ffffff",
    alpha: 0.7,
    angle: 360,
    luminosity: 0.7,
    coloration: 1,
    attenuation: 0.15,
    burnTimeMinutes: 360,
    consumable: true,
    itemName: "Sunrod"
  },
  driftglobe: {
    label: "Driftglobe",
    dim: 40,
    bright: 20,
    color: "#e3ffff",
    alpha: 0.6,
    angle: 360,
    luminosity: 0.6,
    coloration: 2,
    attenuation: 0.2,
    burnTimeMinutes: null,  // infinite unless you change it
    consumable: false,
    itemName: "Driftglobe"
  },
  "spell:light": {
    label: "Light Spell",
    dim: 40,
    bright: 20,
    color: "#e0f0ff",
    alpha: 0.6,
    angle: 360,
    luminosity: 0.6,
    coloration: 2,
    attenuation: 0.25,
    burnTimeMinutes: 60,
    consumable: false,
    itemName: "Light"
  },
  "spell:produceFlame": {
    label: "Produce Flame",
    dim: 20,
    bright: 10,
    color: "#ffbb66",
    alpha: 0.6,
    angle: 360,
    luminosity: 0.6,
    coloration: 1,
    attenuation: 0.25,
    burnTimeMinutes: 10,
    consumable: false,
    itemName: "Produce Flame"
  },

  /* -------- Custom Mezz light sources ---------- */

  hellfireTorch: {
    label: "Hellfire Torch",
    dim: 60,
    bright: 30,
    color: "#ff3300",
    alpha: 0.8,
    angle: 360,
    luminosity: 0.7,
    coloration: 2,
    attenuation: 0.2,
    burnTimeMinutes: 120,
    consumable: true,
    itemName: "Hellfire Torch"
  },
  infernalLantern: {
    label: "Infernal Lantern",
    dim: 80,
    bright: 40,
    color: "#ff0066",
    alpha: 0.8,
    angle: 360,
    luminosity: 0.8,
    coloration: 2,
    attenuation: 0.15,
    burnTimeMinutes: null,
    consumable: false,
    itemName: "Infernal Lantern"
  },
  feylightOrb: {
    label: "Feylight Orb",
    dim: 50,
    bright: 25,
    color: "#66ffcc",
    alpha: 0.7,
    angle: 360,
    luminosity: 0.7,
    coloration: 2,
    attenuation: 0.2,
    burnTimeMinutes: null,
    consumable: false,
    itemName: "Feylight Orb"
  }
};

/* ----------------------------------------------- */
/*  ITEM → PRESET MAPPINGS                         */
/* ----------------------------------------------- */

const LIGHT_ITEM_MAP = {
  "Torch": "torch",
  "Candle": "candle",
  "Lamp": "lamp",
  "Hooded Lantern": "hoodedLantern",
  "Bullseye Lantern": "bullseyeLantern",
  "Sunrod": "sunrod",
  "Driftglobe": "driftglobe",
  "Hellfire Torch": "hellfireTorch",
  "Infernal Lantern": "infernalLantern",
  "Feylight Orb": "feylightOrb"
};

const LIGHT_SPELL_MAP = {
  "Light": "spell:light",
  "Produce Flame": "spell:produceFlame"
};

/* ----------------------------------------------- */
/*  SETTINGS                                       */
/* ----------------------------------------------- */

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "autolight", {
    name: "Enable automatic lighting",
    hint: "Apply lighting automatically when light-producing items or spells are used.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register(MODULE_ID, "burntime", {
    name: "Enable burn time consumption",
    hint: "Light sources expire based on in-game time (About Time / world time).",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register(MODULE_ID, "offhand", {
    name: "Enable off-hand torch detection",
    hint: "If a torch-like item is equipped in an off-hand slot, it will auto-light.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register(MODULE_ID, "gmOverride", {
    name: "GM override hooks",
    hint: "Reserved for future GM UI controls.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  console.log(`${MODULE_ID} | Initialized settings`);
});

/* ----------------------------------------------- */
/*  FLAG HELPERS                                   */
/* ----------------------------------------------- */

function getActorFlags(actor) {
  const base = actor.getFlag(MODULE_ID, "state") || {};
  return {
    activeLightSource: base.activeLightSource ?? null,
    expiresAt: base.expiresAt ?? null
  };
}

async function setActorFlags(actor, partial) {
  const current = actor.getFlag(MODULE_ID, "state") || {};
  const merged = foundry.utils.mergeObject(current, partial, { inplace: false });
  return actor.setFlag(MODULE_ID, "state", merged);
}

function getPresetConfig(key) {
  if (!key) return null;
  return LIGHT_PRESETS[key] ?? null;
}

function getWorldTime() {
  // About Time manipulates game.time.worldTime, we just use that.
  return game.time?.worldTime ?? 0;
}

/* ----------------------------------------------- */
/*  CORE LIGHT APPLICATION                         */
/* ----------------------------------------------- */

async function updateLightEffectIcon(token, isOn) {
  if (!token || typeof token.toggleEffect !== "function") return;
  try {
    await token.toggleEffect(LIGHT_EFFECT_ICON, { active: isOn });
  } catch (err) {
    console.warn(`${MODULE_ID} | Failed to toggle light icon`, err);
  }
}

async function applyLightingForToken(token) {
  try {
    if (!token?.document) return;
    const actor = token.actor;
    if (!actor) return;

    const { activeLightSource } = getActorFlags(actor);
    const preset = getPresetConfig(activeLightSource);

    if (!preset) {
      await token.document.update({
        light: {
          dim: 0,
          bright: 0,
          color: null,
          alpha: 0.0,
          angle: 360,
          luminosity: 0.5,
          coloration: 1,
          attenuation: 0.25
        }
      });
      await updateLightEffectIcon(token, false);
      return;
    }

    const update = {
      dim: preset.dim ?? 0,
      bright: preset.bright ?? 0,
      color: preset.color ?? null,
      alpha: preset.alpha ?? 0.5,
      angle: preset.angle ?? 360,
      luminosity: preset.luminosity ?? 0.5,
      coloration: preset.coloration ?? 1,
      attenuation: preset.attenuation ?? 0.25
    };

    await token.document.update({ light: update });
    await updateLightEffectIcon(token, true);

  } catch (err) {
    console.error(`${MODULE_ID} | Error applying lighting to token`, token, err);
  }
}

async function applyLightingForActorTokens(actor) {
  if (!canvas?.tokens) return;
  const tokens = canvas.tokens.placeables.filter(t => t.actor?.id === actor.id);
  for (const t of tokens) {
    await applyLightingForToken(t);
  }
}

/* ----------------------------------------------- */
/*  TIME / BURNOUT HANDLING                        */
/* ----------------------------------------------- */

async function handleLightBurnout() {
  const burnEnabled = game.settings.get(MODULE_ID, "burntime");
  if (!burnEnabled) return;

  const now = getWorldTime();

  for (const actor of game.actors.contents) {
    const flags = getActorFlags(actor);
    if (!flags.activeLightSource || !flags.expiresAt) continue;
    if (now < flags.expiresAt) continue;

    const preset = getPresetConfig(flags.activeLightSource);
    console.log(`${MODULE_ID} | Light expired for actor ${actor.name}: ${preset?.label ?? flags.activeLightSource}`);

    // Consume item if needed
    if (preset?.consumable && preset.itemName) {
      const item = actor.items.find(i => i.name === preset.itemName);
      if (item) {
        const qty = item.system.quantity ?? 1;
        const newQty = Math.max(0, qty - 1);
        await item.update({ "system.quantity": newQty });
      }
    }

    // Clear flags and update tokens
    await setActorFlags(actor, { activeLightSource: null, expiresAt: null });
    await applyLightingForActorTokens(actor);

    ChatMessage.create({
      speaker: { actor },
      content: `<p><strong>${preset?.label ?? "Light source"}</strong> has burned out.</p>`
    });
  }
}

/* ----------------------------------------------- */
/*  HOOKS                                          */
/* ----------------------------------------------- */

// Re-apply on canvas ready
Hooks.on("canvasReady", () => {
  if (!canvas?.tokens) return;
  canvas.tokens.placeables.forEach(t => applyLightingForToken(t));
});

// Newly created tokens
Hooks.on("createToken", (doc) => {
  const token = canvas.tokens.get(doc.id);
  if (token) applyLightingForToken(token);
});

// If actor flags change (from item use, etc.)
Hooks.on("updateActor", (actor, changes) => {
  const state = changes.flags?.[MODULE_ID]?.state;
  if (!state) return;
  if ("activeLightSource" in state || "expiresAt" in state) {
    applyLightingForActorTokens(actor);
  }
});

// If token light is manually changed, we re-assert preset if any
Hooks.on("updateToken", (doc, changes, options, userId) => {
  const token = canvas.tokens.get(doc.id);
  if (!token) return;

  if (changes.light) {
    const actor = token.actor;
    if (!actor) return;
    const { activeLightSource } = getActorFlags(actor);
    if (activeLightSource) {
      applyLightingForToken(token);
    }
  }
});

// World time updated (About Time / system time)
Hooks.on("updateWorldTime", () => {
  handleLightBurnout();
});

/* ----------------------------------------------- */
/*  ITEM USE HOOKS (DND5E + MIDI-QOL)              */
/* ----------------------------------------------- */

async function handleItemUse(actor, item) {
  if (!actor || !item) return;
  const auto = game.settings.get(MODULE_ID, "autolight");
  if (!auto) return;

  const itemName = item.name;

  let presetKey = LIGHT_ITEM_MAP[itemName];
  if (!presetKey) presetKey = LIGHT_SPELL_MAP[itemName];
  if (!presetKey) return;

  const flags = getActorFlags(actor);
  const isSame = flags.activeLightSource === presetKey;

  // Toggle: if same source already active, turn it off
  let newActive = null;
  let expiresAt = null;

  if (!isSame) {
    newActive = presetKey;
    const preset = getPresetConfig(presetKey);
    if (preset?.burnTimeMinutes && game.settings.get(MODULE_ID, "burntime")) {
      const now = getWorldTime();
      expiresAt = now + preset.burnTimeMinutes * 60;
    }
  }

  await setActorFlags(actor, { activeLightSource: newActive, expiresAt });
  await applyLightingForActorTokens(actor);

  const preset = getPresetConfig(presetKey);
  const label = preset?.label ?? itemName;
  ui.notifications.info(newActive ? `${label} is now illuminating.` : `${label} has been extinguished.`);
}

// D&D5e core use hook
Hooks.on("dnd5e.useItem", async (item, config, options) => {
  const actor = item?.actor;
  if (!actor) return;
  await handleItemUse(actor, item);
});

// Midi-QOL workflow hook
Hooks.on("midi-qol.useItem", async (workflow) => {
  const item = workflow?.item;
  const actor = item?.actor;
  if (!actor || !item) return;
  await handleItemUse(actor, item);
});

console.log(`${MODULE_ID} | Mezz Active Lighting (inventory-driven, About Time) ready.`);
