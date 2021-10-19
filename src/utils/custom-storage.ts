
class CustomStorage {

  private storage: Storage;

  languageKey: string = 'demo_language'

  constructor() {
    this.storage = window.sessionStorage;
  }

  read(key: string): any {
    try {
      let json = JSON.parse(this.storage.getItem(key) as string);
      return json
    } catch(_) {
      return this.storage.getItem(key);
    }
  }

  save(key: string, val: any) {
    this.storage.setItem(key, JSON.stringify(val));
  }

  clear(key: string) {
    this.storage.removeItem(key);
  }

  setLanguage(lang: string) {
    this.save(this.languageKey, lang)
  }

  getLanguage():string {
    const language = this.read(this.languageKey) ? this.read(this.languageKey) : navigator.language;
    return language;
  }
}

const GlobalStorage = new CustomStorage();
// @ts-ignore
window.GlobalStorage = GlobalStorage;
export default GlobalStorage;