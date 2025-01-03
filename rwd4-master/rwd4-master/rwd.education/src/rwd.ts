// First of all, remove the no-js class:
document.documentElement.classList.remove("no-js");

class easyCarousel {
    nextBtn: HTMLElement;
    prevBtn: HTMLElement;
    container: HTMLElement;
    items: NodeListOf<Element>;
    duration: number;
    maxIdx: number;
    currentIdx: number;
    polarity: string;
    random: any;
    constructor(
        nextBtn: HTMLElement,
        prevBtn: HTMLElement,
        container: HTMLElement,
        items: NodeListOf<Element>,
        duration: number
    ) {
        this.nextBtn = nextBtn;
        this.prevBtn = prevBtn;
        this.container = container;
        this.items = items;
        this.maxIdx = items.length - 1;
        this.currentIdx = 0;
        this.polarity = "+";
        this.duration = duration;
        this.nextBtn.addEventListener("click", this.processClick);
        this.prevBtn.addEventListener("click", this.processClick);
        this.random = window.setInterval(this.autoMoveContainer, this.duration);

        window.addEventListener("resize", () => {
            this.moveContainer(this.currentIdx);
        });
    }

    autoMoveContainer = () => {
        this.currentIdx = Math.floor(Math.random() * (this.maxIdx + 1));
        this.moveContainer(this.currentIdx);
    };

    processClick = (e: MouseEvent) => {
        // You are interacting with it, so stop random movement
        window.clearInterval(this.random);
        this.polarity = e.target === this.nextBtn ? "+" : "-";
        if (this.polarity === "+") {
            this.currentIdx =
                this.currentIdx++ >= this.maxIdx
                    ? this.maxIdx
                    : this.currentIdx++;
        } else {
            this.currentIdx = this.currentIdx-- <= 0 ? 0 : this.currentIdx--;
        }
        this.moveContainer(this.currentIdx);
    };

    moveContainer = (num: number) => {
        const containerWidth = this.container.getBoundingClientRect().width;
        // Set the prev button
        num > 0
            ? this.prevBtn.removeAttribute("disabled")
            : this.prevBtn.setAttribute("disabled", "");
        // Set the next button
        num < this.maxIdx
            ? this.nextBtn.removeAttribute("disabled")
            : this.nextBtn.setAttribute("disabled", "");
        // Set the transform distance
        this.container.style.setProperty(
            "--Dist",
            `-${containerWidth * num}px`
        );
    };
}

const quoteNext = document.getElementById("quoteNext");
const quotePrev = document.getElementById("quotePrev");
const quoteContainer = document.querySelector(
    ".rwd-Reviews_Container"
) as HTMLElement;
const quoteItems = quoteContainer.querySelectorAll(".rwd-Review");
if (quoteContainer && quoteNext && quotePrev && quoteContainer && quoteItems) {
    new easyCarousel(quoteNext, quotePrev, quoteContainer, quoteItems, 10000);
}

const imgNext = document.getElementById("imgNext");
const imgPrev = document.getElementById("imgPrev");
const imgContainer = document.querySelector(".rwd-New_Media") as HTMLElement;
const imgItems = imgContainer && imgContainer.querySelectorAll(".rwd-New_Img");
if (imgNext && imgPrev && imgContainer && imgItems) {
    new easyCarousel(imgNext, imgPrev, imgContainer, imgItems, 8000);
}

/*
 * Code source drop down
 */

const codeDropBtn = document.querySelector("button.rwd-Nav_Link");
const downloadPanel = document.getElementById(
    "downloadPanel"
) as HTMLDialogElement;
const downloadDismiss = document.querySelector(".rwd-DownloadPanel_Dismiss");

if (codeDropBtn && downloadPanel && downloadDismiss) {
    codeDropBtn.addEventListener("click", () => {
        downloadPanel.open ? downloadPanel.close() : downloadPanel.showModal();
    });
    downloadDismiss.addEventListener("click", () => {
        downloadPanel.close();
    });
    downloadPanel.addEventListener("click", function(e) {
        console.log(this, e.target);
        e.target === this && this.close();
    });
}

export { };
