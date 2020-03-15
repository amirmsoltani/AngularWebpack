import angular from 'angular';
import $ from "jquery";
import moment from 'moment-jalaali';

const name = 'Components.datePicker';
angular.module(name, []).component('datePicker', {
    transclude: true,
    template: require('./index.html'),
    controller: function () {

        this.weekDay = {M: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'], J: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']};
        this.start = 0;
        this.first = null;
        this.end = null;
        this.hover = null;
        this.type = 'M';
        this.agent = 'desktop';
        let tooltip = false;
        const today = moment();
        const convert = (1000 * 60 * 60 * 24);
        this.monthsName = {
            J: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
            M: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
        };
        const numbers = {0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'};
        this.persianNumber = function (n) {
            let str = '';
            for (let i = 0; i < n.length; i++)
                if (numbers[n[i]])
                    str += numbers[n[i]];
                else
                    str += n[i];
            return str;
        };
        this.$onInit = function () {
            this.changeDate = this.changeDate ? this.changeDate : false;
            if (this.first)
                this.getOneYearMonths(this.first);
            else
                this.getOneYearMonths(today);
            this.desktop = {
                J: [this.months.J[this.start], this.months.J[this.start + 1]],
                M: [this.months.M[this.start], this.months.M[this.start + 1]]
            };
            this.fitToTracker();
            $(window).on('resize', null, this.fitToTracker.bind(this));
        };
        this.fitToTracker = function () {
            var tracker = $(this.fit);
            var offset = tracker.offset();
            var width = $('#date_picker').outerWidth();
            var height = tracker.outerHeight();
            $('#date_picker').offset({
                left: offset.left - width / 2 + tracker.outerWidth() / 2,
                top: offset.top + height + 20
            });
        };
        this.months = {J: [], M: []};
        this.getJDays = function (date) {
            const days = [];
            const weekDay = date.day() % 6;
            for (let i = 0; i <= moment.jDaysInMonth(date.jYear(), date.jMonth()) + weekDay; i++)
                days.push({
                    text: weekDay >= i ? '' : this.persianNumber((i - weekDay).toString()),
                    data: weekDay >= i ? null : moment(date.format('jYYYY/jMM/' + (i - weekDay)), "jYYYY/jMM/jDD")
                });
            return days;
        };
        this.getDays = function (date) {
            const days = [];
            const weekDay = date.day();
            for (let i = 1; i <= date.daysInMonth() + weekDay; i++)
                days.push({
                    text: weekDay >= i ? '' : i - weekDay,
                    data: weekDay >= i ? null : moment(date.format('YYYY/MM/' + (i - weekDay)), "YYYY/MM/DD")
                });
            return days;
        };
        this.getOneYearMonths = function (firstMonth) {
            const month = moment(firstMonth);
            const Jmonth = moment(firstMonth);
            this.months = {J: [], M: []};
            for (let i = 0; i < 12; i++) {
                month.startOf('month');
                this.months.M.push({name: month.month(), days: this.getDays(month)});
                month.add(1, 'Month');
                /*--------------------------------------------------------------------*/
                Jmonth.startOf('jMonth');
                this.months.J.push({name: Jmonth.jMonth(), days: this.getJDays(Jmonth)});
                Jmonth.add(1, 'jMonth');
            }
        };


        this.change_start = function (index) {
            if (index)
                this.start += 1;
            else
                this.start -= 1;
            this.desktop = {
                J: [this.months.J[this.start], this.months.J[this.start + 1]],
                M: [this.months.M[this.start], this.months.M[this.start + 1]]
            }
        };
        this.onHover = function (data, event) {
            if (data.day.text === '')
                return false;
            if (tooltip) {
                tooltip.remove();
                tooltip = false;
                this.hover = null;
                return true;
            }
            const target = event.target;
            const offset = $(target).offset();
            tooltip = document.createElement('span');
            tooltip.className = "date-picker-tooltip";
            if (this.first === null)
                tooltip.innerHTML = "start in";
            else if (this.end === null)
                tooltip.innerHTML = `return ${Math.floor((data.day.data - this.first) / convert)} days later`;
            else if (data.day.data > this.first && data.day.data < this.end)
                tooltip.innerHTML = `after ${Math.floor((data.day.data - this.first) / convert)} days`;
            document.body.append(tooltip);
            tooltip.style.left = offset.left + $(target).width() / 2 + 'px';
            tooltip.style.top = offset.top - tooltip.offsetHeight - 12 + 'px';
            this.hover = data.day.data;

        };
        this.select = function (data) {

            const date = data.day.data;
            if (date < today - convert)
                return '';
            else if (this.first === null)
                this.first = data.day.data;
            else if (this.end === null && Math.floor((data.day.data - this.first) / convert) <= 30 && this.first < date) {
                this.end = data.day.data;
                this.onSelect({first: this.first, end: this.end});
            } else if (this.end !== null && date > today - convert) {
                this.first = date;
                this.end = null;
            }
        };
        this.getClass = function (data) {
            const date = data.day.data;
            if (data.day.text === '' || date === null)
                return '';
            else if (this.first !== null && date.year() === this.first.year() && date.month() === this.first.month() &&
                date.date() === this.first.date())
                return 'date-picker-day-first';
            else if ((this.first !== null) && ((date > this.first && date < this.end)
                || (this.end === null && date > this.first && date < this.hover)))
                return 'date-picker-day-mid';
            else if ((this.end !== null && date.year() === this.end.year() && date.month() === this.end.month() &&
                date.date() === this.end.date() || (this.hover === date && this.end === null)) && this.first !== null)
                return 'date-picker-day-end';
            else if (date < today - convert || ((this.first && Math.floor((date - this.first) / convert)) > 30 || this.first > date) && this.end === null)
                return "date-picker-day-hatchet"

        }


    },
    bindings: {
        first: '<',
        end: '<',
        agent: '=',
        onSelect: '&',
        changeDate: '<',
        title: "<",
        acceptButton: "<",
        onClose: '&',
        fit: '@',
    }
});

export default name;
