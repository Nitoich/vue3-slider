export const PSlider = {
    name: 'PanaramaSlider',
    props: ['height'],
    data() {
        return {
            slides: [],
            indexCurrentSlide: 0,
            width: 0,
            deg: 0
        }
    },
    mounted() {
        console.log(123)
        this.updateWidth();
        window.addEventListener('resize', this.updateWidth)
        let allChildren = this.$refs.carousel.children;
        for (let i = 0; i < allChildren.length; i++) {
            if (allChildren[i].classList.contains('slider-slide')) {
                this.slides.push(allChildren[i]);
                this.slides[i].style.position = 'absolute';
                this.slides[i].transformStyle = 'preserve-3d';
                this.slides[i].transformOrigin = 'center center';
            }
        }

        for(let i = 0; i < this.slides.length; i++) {
            let degPreviousSlide = 0;
            if (i == 0) {
                degPreviousSlide = -(180 - (360 / this.slides.length));
            } else {
                degPreviousSlide = this.slides[i - 1].style.transform;
                degPreviousSlide = degPreviousSlide.slice(degPreviousSlide.indexOf('rotateY('), degPreviousSlide.indexOf('d')).replace('rotateY(', '');
            }
            let currentDeg = Number(degPreviousSlide) + (180 - (360 / this.slides.length));
            console.log(i + ' --- ' + degPreviousSlide);
            console.log(currentDeg)
            this.slides[i].style.transform = `rotateY(${currentDeg}deg) translateZ(${this.width / 2}px)`;
        }

        setInterval(this.rotate, 20)
    },
    methods: {
        updateWidth() {
            this.width = this.$el.offsetWidth;
        },
        rotate() {
            this.$refs.carousel.style.transform = `rotateY(${this.deg}deg)`;
            this.deg = this.deg + 1;
        }
    },
    template: `
        <div @resize="this.updateWidth()" class="slider-main" :style="'height: ' + (this.height === undefined ? 'max-content' : (this.height + 'px'))" style="overflow: hidden; width:100%; position: relative;">
            <div  class="slider-carousel" :style="'transition: 0.3s; perspective: 500px; perspective-origin: 50% 50%; display: flex; height: inherit; min-width: inherit; user-select: none;'">
                <div ref="carousel" class="3d-carousel" style="transform-style: preserve-3d; width: 100%; transform: translateZ(-100px);">
                    <slot></slot>
                </div>
            </div>
        </div>
    `
};

export const slider = {
    name: 'SLIDER',
    props: ['height', 'controls', 'loop'],
    data() {
        return {
            slides: [],
            indexCurrentSlide: this.loop ? 1 : 0,
            width: 0,
            canAnimation: true,
            mouseData: {
                mouseL: false,
                mouseClientX: 0,
                mouseStartPos: 0,
            }
        }
    },
    mounted() {
        this.updateWidth();
        window.addEventListener('resize', this.updateWidth)
        let allChildren = this.$refs.carousel.children;
        for (let i = 0; i < allChildren.length; i++) {
            if (allChildren[i].classList.contains('slider-slide')) {
                this.slides.push(allChildren[i]);
            }
        }




        if(this.loop) {
            let newSlidesArray = [];
            newSlidesArray.push(this.slides[this.slides.length - 1]);
            this.slides.forEach(el => {
                newSlidesArray.push(el);
            })
            newSlidesArray.push(this.slides[0]);

            this.slides = newSlidesArray;


            let newLastElement = this.slides[0].cloneNode(true);
            let newFirstElement = this.slides[this.slides.length - 1].cloneNode(true);

            this.$refs.carousel.append(newFirstElement);
            this.$refs.carousel.prepend(newLastElement);
        }
    },
    methods: {
        next() {
            if(this.loop) {
                this.indexCurrentSlide++;
                if(this.indexCurrentSlide == this.slides.length - 1) {
                    setTimeout(() => {
                        this.canAnimation = false;
                        this.indexCurrentSlide = 1;
                    },300)
                    setTimeout(() => {
                        this.canAnimation = true;
                    }, 350)
                }
            } else {
                if(this.indexCurrentSlide != this.slides.length - 1) {this.indexCurrentSlide++}
            }
        },
        previouse() {
            if(this.loop) {
                this.indexCurrentSlide--;
                if(this.indexCurrentSlide == 0) {
                    setTimeout(() => {
                        this.canAnimation = false;
                        this.indexCurrentSlide = this.slides.length - 2;
                    }, 300);
                    setTimeout(() => {
                        this.canAnimation = true;
                    }, 350);
                }
            } else {
                if(this.indexCurrentSlide != 0) {this.indexCurrentSlide--}
            }

        },
        updateWidth() {
            this.width = this.$el.offsetWidth;
        },
        mouseDown(event) {
            this.mouseData.mouseL = true;
            this.mouseData.mouseStartPos = event.clientX;
            this.mouseData.mouseClientX = event.clientX;
            this.$refs.carousel.addEventListener('mousemove', this.moving)
            this.$refs.carousel.addEventListener('mouseleave', this.mouseUp);
        },
        mouseUp() {
            this.mouseData.mouseL = false;
            if (this.shiftMouse > this.width / 4) {
                this.next();
            } else if(this.shiftMouse < -(this.width / 4)) {
                this.previouse();
            }

            this.$refs.carousel.removeEventListener('mousemove', this.moving);
            this.$refs.carousel.removeEventListener('mouseleave', this.mouseUp);
        },
        moving(event) {
            this.mouseData.mouseClientX = event.clientX;
            console.log(this.shiftMouse)
        }
    },
    computed: {
        shift() {
            return this.mouseData.mouseL ? this.shiftMouse + (this.width * this.indexCurrentSlide) : (this.width * this.indexCurrentSlide);
        },
        shiftMouse() {
            return (this.mouseData.mouseStartPos - this.mouseData.mouseClientX);
        }
    },
    template: `
        <div @resize="this.updateWidth()" class="slider-main" :style="'height: ' + (this.height === undefined ? 'max-content' : (this.height + 'px'))" style="overflow: hidden; width:100%; position: relative;">
            <div ref="carousel" @mousedown="this.mouseDown($event)" @mouseup="this.mouseUp()" class="slider-carousel" :style="'cursor:' + (this.mouseData.mouseL ? 'grabbing' : 'grab') + '; transition: ' + ((this.mouseData.mouseL || !this.canAnimation) ? '0' : '0.3s') + '; transform: translateX(-' + this.shift + 'px);  display: flex; height: inherit; min-width: inherit; user-select: none;'">
                <slot></slot>
            </div>
            <button v-if="this.controls ?? true" class="slider-nextButton" @click="this.next()" style="position: absolute; top: 50%; right: 20px;">-></button>
            <button v-if="this.controls ?? true" class="slider-previousButton" @click="this.previouse()" style="position: absolute; top: 50%; left: 20px;"><-</button>
        </div>
    `
}

export const PerspectiveSlider = {
    name: 'PERSPECTIVE-SLIDER',
    data() {
        return {
            slides: [],
            indexCurrentSlide: 0,
            width: 0,
            isAnimate: false
        }
    },
    mounted() {
        this.updateWidth()
            window.addEventListener('resize', this.updateWidth)
        let allChildren = this.$refs.carousel.children;
        for (let i = 0; i < allChildren.length; i++) {
            if (allChildren[i].classList.contains('slider-slide')) {
                this.slides.push(allChildren[i]);
            }
        }
    },
    methods: {
        next() {
            this.isAnimate = true;
            this.slides[this.indexCurrentSlide].style.margin = '0 50px';
            let oldSlide = this.indexCurrentSlide;
            (this.indexCurrentSlide == this.slides.length - 1) ? this.indexCurrentSlide = 0 : this.indexCurrentSlide++;
            let timeout = setTimeout(() => {
                this.slides[oldSlide].style.margin = '0';
                this.isAnimate = false;
            }, 400);
        },
        updateWidth() {
            this.width = this.$el.offsetWidth;
        }
    },
    computed: {
        shift() {
            return (this.width * this.indexCurrentSlide);
        }
    },
    template: `
    <div class="slider-main" @click="this.next()" style="overflow: hidden; width:100%; position: relative; background: #121212" :style="'height: 500px'">
        <div ref="carousel" class="perspective-block" :style="'transform: perspective(400px) translateZ(' + (this.isAnimate ? '-100px' : '0px') + ') translateX(-' + this.shift + 'px)'" style="transition: 0.4s;display: flex; height: inherit">
            <slot></slot>
        </div>
    </div>
    `
}

export const slide = {
    name: 'SLIDE',
    template: `
        <div class="slider-slide" style=" min-width: 100%; height: 100%">
            <slot></slot>
        </div>
    `
}