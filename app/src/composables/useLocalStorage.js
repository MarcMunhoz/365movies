export const getLocalStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Erro ao ler "${key}" do localStorage`, e);
    return defaultValue;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao salvar "${key}" no localStorage`, e);
  }
};

export const getSessionStorage = (key, defaultValue = []) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Erro ao ler "${key}" do sessionStorage`, e);
    return defaultValue;
  }
};

export const setSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao salvar "${key}" no sessionStorage`, e);
  }
};

export const removeSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.error(`Erro ao remover "${key}" do sessionStorage`, e);
  }
};
