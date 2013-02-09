Package.describe({
    summary : "Keybinding package for meteor"
});

Package.on_use(function (api) {
    api.use('jquery', 'client');
    api.use('underscore', 'client');

    api.add_files([
        'lib/jwerty.min.js',
        'lib/keybindings.min.js'
    ], 'client'
    );
});