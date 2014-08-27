Package.describe({
    name : "matteodem:keybindings",
    version : "0.4.1",
    summary : "Keybinding package for meteor"
});

Package.on_use(function (api) {
    api.versionsFrom('METEOR@0.9.0');

    api.use('jquery', 'client');
    api.use('underscore', 'client');

    api.add_files([
        'lib/jwerty.min.js',
        'lib/keybindings.js'
    ], 'client'
    );
});
