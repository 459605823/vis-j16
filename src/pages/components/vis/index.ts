import {THREE, Viz} from '@f80975/viz.js';
import {componentManager} from './components/index';

const isDev = import.meta.env.DEV || window.location.search.includes('dev');

export default class {
  viz: Viz;

  constructor(container: HTMLElement) {
    const viz = new Viz({
      container,
      dev: isDev,
    }, {
      componentManager,
    });
    viz.assetManager.setAsset([
      {type: 'gltf', url: '/models/J16.gltf', name: 'J16', version: '0.0.1'},
      {type: 'texture', url: '/textures/HDR.jpg', name: 'env', version: '0.0.1'},
    ]);
    this.viz = viz;
  }

  async setEnvMap() {
    const pmremGenerator = new THREE.PMREMGenerator(this.viz.renderer!);
    pmremGenerator.compileEquirectangularShader();
    const hdr = await this.viz.assetManager.getAsset<THREE.Texture>('env');
    const envMap = pmremGenerator.fromEquirectangular(hdr!).texture;
    this.viz.scene!.environment = envMap;
    hdr?.dispose();
    pmremGenerator.dispose();
  }

  async init() {
    await this.viz.assetManager.load();
    await this.setEnvMap();
    await componentManager.draw('Plane');
    this.viz.start();
  }

  dispose() {
    this.viz.dispose();
    this.viz = null!;
  }
}
