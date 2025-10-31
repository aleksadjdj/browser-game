$(async function() {
  const baseURL = window.location.origin;
  let TILESET = {};
  let mapData = [];
  let tileSize = 64;
  let currentMapSlug = null;

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

    // Load tileset for that mapSlug
    try {
      const ts = await fetch(`/api/editor/tiles/${currentMapSlug}`).then(r => r.json());
      if (!ts || !ts.tiles) return alert('Tileset not found for this map.');
      TILESET = ts.tiles;
    } catch (err) {
      console.error('❌ Failed to load tileset:', err);
      alert('Could not load tileset for this map.');
      return;
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

    // Populate block selector
    $('#blockType').empty();
    for (const t of TILESET) {
      $('#blockType').append(`<option value="${t.slug}">${t.displayName}</option>`);
    }
    updatePreview();

    // Create empty grid
    mapData = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const div = $('<div class="tile"></div>')
          .attr('data-x', x).attr('data-y', y)
          .css({ width: tileSize, height: tileSize });
        $('#map').append(div);
      }
    }
  });

  // 🖼️ Update tile preview
  $('#blockType').on('change', updatePreview);
  function updatePreview() {
    const selectedSlug = $('#blockType').val();
    const tile = TILESET.find(t => t.slug === selectedSlug);
    if (tile) $('#tilePreview').css('background-image', `url(${baseURL}${tile.textureUrl})`);
  }

  // ✏️ Place tile
$('#map').on('click', '.tile', function() {
  const x = +$(this).data('x');
  const y = +$(this).data('y');
  const selectedSlug = $('#blockType').val();
  const tile = TILESET.find(t => t.slug === selectedSlug);
  if (!tile) return;

  // Update the tile’s visual
  $(this).css('background-image', `url(${baseURL}${tile.textureUrl})`);

  // Update or add to map data
  const existing = mapData.find(t => t.x === x && t.y === y);
  if (existing) {
    existing.tileSlug = tile.slug;
    existing.textureUrl = tile.textureUrl;
  } else {
    mapData.push({
      x, y,
      tileSlug: tile.slug,
      textureUrl: tile.textureUrl
    });
  }
});

  // 💾 Export
  $('#export').on('click', () => {
    const displayName = $('#mapSelect option:selected').text();
    const slug = currentMapSlug;
    const width = +$('#mapWidth').val();
    const height = +$('#mapHeight').val();

    const json = JSON.stringify({ slug, displayName, width, height, data: mapData }, null, 2);
    $('#output').val(json);
    downloadJSON(`${slug}.json`, json);
  });

  function downloadJSON(filename, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  // 📂 Import JSON
  $('#import').on('click', () => {
    const input = $('<input type="file" accept=".json" style="display:none">');
    input.on('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      const json = JSON.parse(await file.text());
      loadImportedMap(json);
    });
    input.click();
  });

  function loadImportedMap(json) {
  // Support both old and new JSON formats
  const slug = json.mapSlug || json.slug;
  const displayName = json.name || json.displayName || slug;
  const width = json.width || 0;
  const height = json.height || 0;
  const data = json.data || [];

  $('#setup').hide();
  $('#toolbar').show();
  $('#map').empty().css({
    gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
    gridTemplateRows: `repeat(${height}, ${tileSize}px)`
  });

  $('#mapTitle').text(displayName);
  mapData = data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = data.find(t => t.x === x && t.y === y);
      const img = cell ? (cell.textureUrl || cell.texture) : '';
      const div = $('<div class="tile"></div>')
        .attr('data-x', x).attr('data-y', y)
        .css({
          width: tileSize,
          height: tileSize,
          backgroundImage: img ? `url(${baseURL}${img})` : 'none'
        });
      $('#map').append(div);
    }
  }
}


});
