const { override, fixBabelImports, addLessLoader } = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                dark: true,
                '@primary-color':   '#dddddd',
                '@heading-color':   '#ffffff',
                '@text-color'   :   '#000000'
            }
        }
    })
);
