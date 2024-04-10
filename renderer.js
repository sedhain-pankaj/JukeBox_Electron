const func = async () => {
  const response = await window.versions.ping();
  cache = response
    .match(/<section id="([^"]+)">([\s\S]*?)<\/section>/g)
    .map((section) => {
      let id = section.match(/id="([^"]+)"/)[1];
      let content = section.match(
        /<section id="[^"]+">([\s\S]*?)<\/section>/
      )[1];
      let obj = {};
      obj[id] = content;
      return obj;
    });
};

func();
