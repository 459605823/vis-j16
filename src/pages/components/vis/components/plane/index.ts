import type {STDLIB} from '@f80975/viz.js';
import {Component, THREE} from '@f80975/viz.js';

export class Plane extends Component {
  name = 'Plane';

  animations: {[key: string]: THREE.AnimationClip} = {};
  mixer: THREE.AnimationMixer | null = null;
  currentAction: THREE.AnimationAction | null = null;

  async create() {
    const model = await this.viz?.assetManager.getAsset<STDLIB.GLTF>('J16');
    console.log('model', model);
    if (!model)
      return;
    model.scene.scale.setScalar(0.01);
    this.object3D.add(model.scene);

    // 创建AnimationMixer
    this.mixer = new THREE.AnimationMixer(model.scene);

    model.animations.forEach((clip) => {
      this.animations[clip.name] = clip;
    });
    console.log('animations', this.animations);
  }

  playAnimation(name: string) {
    if (!this.mixer || !this.animations[name]) {
      console.warn(`Animation "${name}" not found`);
      return;
    }

    // 停止当前动画
    if (this.currentAction) {
      this.currentAction.fadeOut(0.5);
    }

    // 播放新动画
    const clip = this.animations[name];
    const action = this.mixer.clipAction(clip);
    action.reset();
    action.fadeIn(0.5);
    action.setLoop(THREE.LoopOnce, 1); // 只播放一次
    action.clampWhenFinished = true; // 播放完停在最后一帧
    action.play();

    this.currentAction = action;
    console.log(`Playing animation: ${name}`);
  }

  update(delta: number) {
    // 更新动画混合器
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  render() {
    const gui = this.viz?.guiManager;
    if (gui) {
      const folder = gui.addFolder('Plane', {});

      // 为每个动画添加按钮
      Object.keys(this.animations).forEach((animationName) => {
        gui.addButton(animationName, () => {
          this.playAnimation(animationName);
        }, folder);
      });
    }
  }
}
