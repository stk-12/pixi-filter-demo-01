

class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth - 100,
      height: window.innerHeight -100,
    }

    this.canvas = document.getElementById('canvas');

    this.aspectRatio = 16 / 9;
    this.videoList = [
      {
        name: 'video01',
        path: 'video01.mp4',
        zIndex: 3,
      },
      {
        name: 'video02',
        path: 'video02.mp4',
        zIndex: 1,
      },
      // {
      //   name: 'video03',
      //   path: 'video03.mp4',
      // }
    ];

    this.backgrounds = {};

    this.app = new PIXI.Application({
      width: window.innerWidth - 100,
      height: window.innerHeight - 100,
      view: this.canvas,
      // backgroundColor: 0x1099bb,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
    });
    this.app.stage.eventMode = 'static';

    this.container = new PIXI.Container();
    this.container.sortableChildren = true; // zIndexを有効化
    this.app.stage.addChild(this.container);


    this.displacementSprite = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg');
    // this.displacementSprite = PIXI.Sprite.from('filter.png');
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;


    // this.app.ticker.add((delta) => this.update(delta));

    this._init();

    this._addEvent();
  }

  _init() {
    this._setupBgVideo();
    this._setupDisplacementFilter()

    this._setupAnimation();
  }

  _setupBgVideo() {
    this.videoList.forEach((video) => {
      const videoTexture = PIXI.Texture.from(video.path); // videoのサイズは16:9にする
      const videoSprite = new PIXI.Sprite(videoTexture);
      videoSprite.name = video.name;
      videoSprite.zIndex = video.zIndex;

      const videoElement = videoTexture.baseTexture.resource.source;
      videoElement.muted = true; // ビデオをミュートに設定
      videoElement.loop = true; // ビデオをループに設定

      this._resizeVideoSprite(videoSprite);
      this.container.addChild(videoSprite);

      this.backgrounds[video.name] = videoSprite;
    });
  }

  // 動画サイズ設定
  _resizeVideoSprite(videoSprite) {
    
    // 高さ揃えでサイズ設定
    const height = this.viewport.height;
    const width = height * this.aspectRatio;

    // スプライトのサイズと位置を更新
    videoSprite.width = width;
    videoSprite.height = height;
    videoSprite.x = this.viewport.width / 2 - width / 2;
    // videoSprite.y = this.viewport.height / 2;
  }

  _setupDisplacementFilter() {
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
    this.container.filters = [this.displacementFilter];

    this.displacementFilter.padding = 10;
    this.displacementFilter.scale.x = 0;
    this.displacementFilter.scale.y = 0;

    this.app.stage.addChild(this.displacementSprite);
  }

  _setupAnimation() {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(this.backgrounds.video01, {
      duration: 0.3,
      delay: 3.0,
      ease: 'power2.inOut',
      pixi: {
        alpha: 0,
      },
    })
    .to(this.displacementFilter.scale, {
      duration: 0.15,
      y: 200,
      // x: 200,
      ease: 'expo.inOut',
    }, '<')
    .to(this.displacementFilter.scale, {
      duration: 0.15,
      y: 0,
      // x: 0,
      ease: 'expo.inOut',
    })
    .to(this.backgrounds.video01, {
      duration: 0.3,
      ease: 'power2.inOut',
      pixi: {
        alpha: 1,
        // displacementFilter: { scaleX: 0.5, scaleY: 0.5 }
      }
    }, '+=3.0')

  }

  // update(delta) {

  // }

  _reseize() {
    this.viewport.width = window.innerWidth - 100;
    this.viewport.height = window.innerHeight - 100;
    this.app.renderer.resize(this.viewport.width, this.viewport.height);
  }

  _addEvent() {
    window.addEventListener('resize', this._reseize.bind(this));
  }
}

window.addEventListener('load', () => {
  new Main();
});