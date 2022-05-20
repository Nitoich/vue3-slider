export const slider = {
    name: 'SLIDER',
    data() {
        return {
            slides: [],
            indexCurrentSlide: 0,
            width: 0,
        }
    },
    mounted() {

        let allChildren = this.$refs.carousel.children;
        for (let i = 0; i < allChildren.length; i++) {
            if (allChildren[i].classList.contains('slider-slide')) {
                this.slides.push(allChildren[i]);
            }
        }
        console.log(this.slides)
    },
    methods: {
        next() {
            this.updateWidth();
            console.log(this.indexCurrentSlide);
            console.log(this.slides.length)
            if(this.indexCurrentSlide == this.slides.length - 1) {
                this.indexCurrentSlide = 0;
            } else {
                this.indexCurrentSlide++;
            }
        },
        previouse() {
            this.updateWidth();
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
            console.log(this.indexCurrentSlide)
            return (this.width * this.indexCurrentSlide);
        }
    },
    template: `
        <div class="slider-main" style="overflow: hidden; width:100%; height: 500px; position: relative;">
            <div ref="carousel" class="slider-carousel" :style="'transition: 0.3s; transform: translateX(-' + this.shift + 'px);  display: flex; height: inherit; min-width: inherit'">
                <slot></slot>
            </div>
            <button class="slider-nextButton" @click="this.next()" style="position: absolute; top: 50%; right: 20px;">-></button>
            <button class="slider-previousButton" @click="this.previouse()" style="position: absolute; top: 50%; left: 20px;"><-</button>
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