export default {
  entry: 'src/index.js',
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  cjs: 'babel',
  extraBabelPlugins: [['import', { libraryName: 'antd', style: true }]],
};
