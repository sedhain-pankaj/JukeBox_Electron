const func = async () => {
  const response = await window.versions.ping();
  cache = response;
};

func();
