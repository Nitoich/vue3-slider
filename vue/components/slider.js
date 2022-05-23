export const slider = {
    name: 'SLIDER',
    props: ['height'],
    data() {
        return {
            slides: [],
            indexCurrentSlide: 0,
            width: 0,
        }
    },
    mounted() {
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
            this.updateWidth();
            if(this.indexCurrentSlide == this.slides.length - 1) {
                this.indexCurrentSlide = 0;
            } else {
                this.indexCurrentSlide++;
            }
        },
        previouse() {
            if(this.indexCurrentSlide == 0) {
                this.indexCurrentSlide = this.slides.length - 1;
            } else {
                this.indexCurrentSlide--;
            }
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
        <div @resize="this.updateWidth()" class="slider-main" :style="'height: ' + (this.height === undefined ? 'max-content' : (this.height + 'px'))" style="overflow: hidden; width:100%; position: relative;">
            <div ref="carousel" class="slider-carousel" :style="'transition: 0.3s; transform: translateX(-' + this.shift + 'px);  display: flex; height: inherit; min-width: inherit'">
                <slot></slot>
            </div>
            <button class="slider-nextButton" @click="this.next()" style="position: absolute; top: 50%; right: 20px;">-></button>
            <button class="slider-previousButton" @click="this.previouse()" style="position: absolute; top: 50%; left: 20px;"><-</button>
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
        <div class="slider-slide" style="position: relative; min-width: 100%; height: 100%">
            <slot></slot>
        </div>
    `
}