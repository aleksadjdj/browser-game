$(async function() {
  const baseURL = window.location.origin;
  let TILESET = [];
  let ENTITY_MODELS = [];
  let mapData = [];
  let entityData = [];
  let tileSize = 64;
  let currentMapSlug = null;
  let selectedEntity = null; // currently selected entity for editing

  // 🧭 Load available maps
  try {
    const maps = await fetch('/api/editor/maps').then(r => r.json());
    for (const m of maps) {
      $('#mapSelect').append(`<option value="${m.slug}">${m.displayName}</option>`);
    }
  } catch (e) {
    alert('❌ Failed to load maps');
    return;
  }

  // 🚀 Start editor
  $('#start').on('click', async () => {
    currentMapSlug = $('#mapSelect').val();
    const width = +$('#mapWidth').val();
    const height = +$('#mapHeight').val();
    tileSize = +$('#tileSize').val();

    if (!currentMapSlug) return alert('Please select a map.');

    // Load tileset
    try {
      const ts = await fetch(`/api/editor/tiles/${currentMapSlug}`).then(r => r.json());
      TILESET = ts.tiles || [];
    } catch (err) {
      console.error('❌ Failed to load tileset:', err);
      return alert('Could not load tileset.');
    }

    // Load entity models
    try {
      ENTITY_MODELS = await fetch(`/api/editor/entity-models`).then(r => r.json());
    } catch (err) {
      console.error('❌ Failed to load entity models:', err);
      alert('Could not load entity models.');
    }

    // Build UI
    $('#setup').hide();
    $('#toolbar').show();
    $('#mapTitle').text($('#mapSelect option:selected').text());
    $('#map').css({
      display: 'grid',
      gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
      gridTemplateRows: `repeat(${height}, ${tileSize}px)`
    }).empty();

    // Populate dropdown with tiles + entities
    $('#blockType').empty();
    $('#blockType').append(`<optgroup label="Tiles"></optgroup>`);
    for (const t of TILESET) {
      $('#blockType optgroup[label="Tiles"]').append(`<option value="tile:${t.slug}">${t.displayName}</option>`);
    }

    $('#blockType').append(`<optgroup label="Entities"></optgroup>`);
    for (const e of ENTITY_MODELS) {
      $('#blockType optgroup[label="Entities"]').append(`<option value="entity:${e.type}">${e.name}</option>`);
    }

    updatePreview();

    // Build empty grid
    mapData = [];
    entityData = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const div = $('<div class="tile"></div>')
          .attr('data-x', x).attr('data-y', y)
          .css({ width: tileSize, height: tileSize });
        $('#map').append(div);
      }
    }
  });

  // 🖼️ Preview
  $('#blockType').on('change', updatePreview);

  function updatePreview() {
    const selected = $('#blockType').val();
    let texture = '';

    if (!selected) {
      $('#tilePreview').css('background-image', 'none');
      return;
    }

    if (selected.startsWith('tile:')) {
      const slug = selected.split(':')[1];
      const tile = TILESET.find(t => t.slug === slug);
      texture = tile?.textureUrl || '';
    }
    else if (selected.startsWith('entity:')) {
      const type = selected.split(':')[1];
      const entityModel = ENTITY_MODELS.find(e => e.type === type);
      const textureField = entityModel?.fields.find(f => f.key === 'texture');
      texture = textureField?.value || `/images/entities/static/${type}.png`;
    }

    $('#tilePreview').css({
      'background-image': texture ? `url(${baseURL}${texture})` : 'none',
      'width': tileSize + 'px',
      'height': tileSize + 'px'
    });
  }

 // ✏️ Place tile/entity or select entity
$('#map').on('click', '.tile', function() {
  const x = +$(this).data('x');
  const y = +$(this).data('y');
  const selected = $('#blockType').val();

  if (!selected) return;

  // === TILE MODE ===
  if (selected.startsWith('tile:')) {
    const slug = selected.split(':')[1];
    const tile = TILESET.find(t => t.slug === slug);
    if (!tile) return;

    $(this).css('background-image', `url(${baseURL}${tile.textureUrl})`);
    const existing = mapData.find(t => t.x === x && t.y === y);
    if (existing) Object.assign(existing, { tileSlug: tile.slug, textureUrl: tile.textureUrl });
    else mapData.push({ x, y, tileSlug: tile.slug, textureUrl: tile.textureUrl });

    // Deselect entity editor
    selectedEntity = null;
    $('#entityEditor').hide();
  }

  // === ENTITY MODE ===
  else if (selected.startsWith('entity:')) {
    const type = selected.split(':')[1];
    const entityModel = ENTITY_MODELS.find(e => e.type === type);
    if (!entityModel) return;

    // Ensure tile is relative
    $(this).css('position', 'relative');

    // Remove existing entity div
    $(this).find('.entity').remove();

    // --- Build entity data object first ---
    const entity = {};
    for (const field of entityModel.fields) {
      if (field.key === 'x') entity[field.key] = x;
      else if (field.key === 'y') entity[field.key] = y;
      else if (field.key === 'mapSlug') entity[field.key] = currentMapSlug;
      else if (field.value !== undefined) entity[field.key] = field.value;
      else entity[field.key] = null;
    }

    // Add additional metadata if needed
    entity.type = entityModel.type;
    entity.slug = entity.slug;
    entity.displayName = entity.displayName || entityModel.displayName || '';
    entity.destX = entity.destX || 0;
    entity.destY = entity.destY || 0;
    entity.destMapSlug = entity.destMapSlug || '';

    // Make sure texture is full path
    const textureField = entityModel.fields.find(f => f.key === 'texture');
    entity.texture = textureField?.value;

  const entityDiv = $('<div class="entity"></div>').css({
    width: tileSize + 'px',
    height: tileSize + 'px',
    backgroundImage: `url(${baseURL}${entity.texture})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none'
  });

  // Add data attributes from entity object
  for (const key in entity) {
    if (entity.hasOwnProperty(key) && entity[key] !== undefined && entity[key] !== null) {
      entityDiv.attr(`data-${key.toLowerCase()}`, entity[key]); // lowercase for consistency
    }
  }

  $(this).append(entityDiv);

    // Remove old entity for same tile and add new
    entityData = entityData.filter(e => !(e.x === x && e.y === y));
    entityData.push(entity);

    // Select entity for editing
    selectedEntity = entity;
    $('#entityEditor').show();
    $('#entityDisplayName').val(entity.displayName || '');
    $('#entityDestMapSlug').val(entity.destMapSlug || '');
    $('#entityDestX').val(entity.destX || 0);
    $('#entityDestY').val(entity.destY || 0);
  }

  // === SELECT EXISTING ENTITY ON TILE ===
  const existingEntityDiv = $(this).find('.entity');
  if (existingEntityDiv.length && !selected.startsWith('tile:')) {
    const entityOnTile = entityData.find(e => e.x === x && e.y === y);
    if (entityOnTile) {
      selectedEntity = entityOnTile;
      $('#entityEditor').show();
      $('#entityDisplayName').val(entityOnTile.displayName || '');
      $('#entityDestMapSlug').val(entityOnTile.destMapSlug || '');
      $('#entityDestX').val(entityOnTile.destX || 0);
      $('#entityDestY').val(entityOnTile.destY || 0);
    }
  }
});


  // 💾 Save entity property changes
  $('#saveEntity').on('click', function() {
    if (!selectedEntity) return;

    // Update entity object
    selectedEntity.displayName = $('#entityDisplayName').val();
    selectedEntity.destMapSlug = $('#entityDestMapSlug').val();
    selectedEntity.destX = +$('#entityDestX').val();
    selectedEntity.destY = +$('#entityDestY').val();

    // Update the DOM div's data-* attributes
    const div = $(`.tile[data-x=${selectedEntity.x}][data-y=${selectedEntity.y}] .entity`);
    if (div.length) {
      div.attr('data-displayname', selectedEntity.displayName);
      div.attr('data-destmapslug', selectedEntity.destMapSlug);
      div.attr('data-destx', selectedEntity.destX);
      div.attr('data-desty', selectedEntity.destY);
    }

    alert('✅ Entity updated!');
  });


  // 💾 Export map + entities
  $('#export').on('click', () => {
    const displayName = $('#mapSelect option:selected').text();
    const slug = currentMapSlug;
    const width = +$('#mapWidth').val();
    const height = +$('#mapHeight').val();

    const fullMapJson = {
      slug,
      displayName,
      width,
      height,
      data: mapData,      // tiles
      entities: entityData // all entities (portals, NPCs, etc.)
    };

    downloadJSON(`map_${slug}.json`, JSON.stringify(fullMapJson, null, 2));
  });

  // 💼 Import JSON
$('#import').on('click', async () => {
  const fileInput = $('<input type="file" accept=".json">');
  fileInput.on('change', async function () {
    const file = this.files[0];
    if (!file) return;

    const text = await file.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (err) {
      return alert('❌ Invalid JSON');
    }

    // Clear previous map
    $('#map').empty();
    mapData = [];
    entityData = [];
    currentMapSlug = json.slug;

    const width = json.width;
    const height = json.height;
    tileSize = $('#tileSize').val(); // keep current tileSize

    // Update UI
    $('#setup').hide();
    $('#toolbar').show();
    $('#mapTitle').text(json.displayName || json.slug);

    $('#map').css({
      display: 'grid',
      gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
      gridTemplateRows: `repeat(${height}, ${tileSize}px)`
    });

    // Build grid
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const div = $('<div class="tile"></div>')
          .attr('data-x', x)
          .attr('data-y', y)
          .css({ width: tileSize, height: tileSize, position: 'relative' });
        $('#map').append(div);
      }
    }

    // Set tiles
    if (json.data) {
      for (const t of json.data) {
        const div = $(`.tile[data-x=${t.x}][data-y=${t.y}]`);
        if (div.length) {
          div.css('background-image', `url(${baseURL}${t.textureUrl})`);
          mapData.push(t);
        }
      }
    }

    // Set entities
    if (json.entities) {
      for (const e of json.entities) {
        const div = $(`.tile[data-x=${e.x}][data-y=${e.y}]`);
        if (div.length) {
          const texture = e.texture || `/images/entities/static/${e.type}.png`;
          const entityDiv = $('<div class="entity"></div>').css({
            width: tileSize + 'px',
            height: tileSize + 'px',
            backgroundImage: `url(${baseURL}${texture})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none'
          });

          // Add data-attributes from entity object
          for (const key in e) {
            if (e.hasOwnProperty(key) && e[key] !== undefined && e[key] !== null) {
              entityDiv.attr(`data-${key}`, e[key]);
            }
          }
          div.append(entityDiv);
          entityData.push(e);
        }
      }
    }

    alert('✅ Map imported successfully!');
  });
  fileInput.trigger('click');
});


  function downloadJSON(filename, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
});
