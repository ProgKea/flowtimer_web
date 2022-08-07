const State = {
    break: 0,
    work: 1,
    waiting: 2
}

const time_regex = /\d\d:\d\d:\d\d/;

class Timer {
    constructor() {
        this.break_time = 0;
        this.break_time_in_mil = 0;
        this.work_start = 0;
        this.work_time = 0;
        this.title = "";
        this.state = State.waiting;
        this.iteration = 0;
        this.ratio = 5;
    }

    switch_state() {
        switch(this.state) {
        case State.waiting:
        case State.break:
            this.work_start = new Date().getTime();
            this.state = State.work;
            this.break_time_in_mil = 0;
            this.iteration = 0;
            document.getElementById("button").innerHTML = "Take a break";
            break;
        case State.work:
            this.state = State.break;
            document.getElementById("button").innerHTML = "Start working";
            break;
        }

        this.update();
    }

    update_state() {
        switch(this.state) {
        case State.work:
            this.iteration++;
            this.title = `You've worked for: ${time_regex.exec(this.work_time)}`;
            break;
        case State.break:
            this.update_break_timer();
            // TODO: put this process in a seperate function
            let break_time = new Date();
            break_time.setHours(0);
            break_time.setMinutes(0);
            break_time.setSeconds(this.break_time_in_mil / 1000);
            this.break_time = break_time;
            this.title = `Break: ${time_regex.exec(this.break_time)}`;
            break;
        case State.waiting:
            this.title = "Click to Start working";
            break;
        }
        document.getElementById("title").innerHTML = this.title;
    }

    update_work_timer() {
        let now = new Date().getTime();
        let work_mil = now - this.work_start;
        let work_time = new Date();
        work_time.setHours(0);
        work_time.setMinutes(0);
        work_time.setSeconds(work_mil / 1000);

        this.work_time = work_time;
    }

    set_break_timer() {
        if (this.iteration === this.ratio) {
            this.break_time_in_mil += 1000;
            this.iteration = 0;
        }
    }

    update_break_timer() {
        if (this.break_time_in_mil <= 0) {
            this.state = State.waiting;
        } else {
            this.break_time_in_mil -= 1000;   
        }
    }

    update() {
        this.update_work_timer();
        this.set_break_timer();
        this.update_state();
    }
}

(() => {
    timer = new Timer();
    window.setInterval(function(){
        timer.update();
    }, 1000);
})()
