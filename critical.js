const critical = require('critical');

critical.generate({
    // configuration
    base: 'public/',
    src: 'index.html',
    target: 'index-critical.html',
    inline: true,
    dimensions: [
      {
        height: 500,
        width: 300,
      },
      {
        height: 720,
        width: 1280,
      },
    ]
},(err, output) => {
  if (err) {
    console.error(err);
  } else if (output) {
    console.log('Generated critical CSS');
  }
});