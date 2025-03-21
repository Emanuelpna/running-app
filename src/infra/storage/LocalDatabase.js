import AsyncStorage from "@react-native-async-storage/async-storage";

const LocalDatabase = {
  keys() {
    return AsyncStorage.getAllKeys();
  },

  async hasKey(key) {
    const item = await AsyncStorage.getItem(key)

    return item !== null;
  },

  get(key) {
    if (!Array.isArray(key)) {
      return AsyncStorage.getItem(key).then(value => {
        return JSON.parse(value);
      });
    } else {
      return AsyncStorage.multiGet(key).then(values => {
        return values.map(value => {
          return JSON.parse(value[1]);
        });
      });
    }
  },

  async save(key, value) {
    try {
      if (!Array.isArray(key)) {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
      } else {
        var pairs = key.map(function (pair) {
          return [pair[0], JSON.stringify(pair[1])];
        });
        return await AsyncStorage.multiSet(pairs);
      }
    } catch (error) {
      console.error('LocalDatabase.save :>> ', error);
    }
  },

  async update(key, value) {
    const item = await this.get(key)

    value = typeof value === 'string' ? value : Object.assign(item, value);

    return AsyncStorage.setItem(key, JSON.stringify(value));

  },

  delete(key) {
    if (Array.isArray(key)) {
      return AsyncStorage.multiRemove(key);
    } else {
      return AsyncStorage.removeItem(key);
    }
  },

  async push(key, value) {
    const currentValue = await this.get(key)

    if (currentValue === null) {
      return await this.save(key, [value]);
    }

    if (Array.isArray(currentValue)) {
      return await this.save(key, [...currentValue, value]);
    }

    console.error('LocalDatabase.push :>> ', new Error(`Existing value for key "${key}" must be of type null or Array, received ${typeof currentValue}.`));
  },
};

export default LocalDatabase;
