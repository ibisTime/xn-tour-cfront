define([
	'dojo/date',
	'dojo/date/stamp',
	'dojo/date/locale'
], function(date, stamp, locale) {
	return {
		format: function(date, pattern) {
//			return stamp.toISOString(date, {
//				selector: 'date'
//			})
            if (!Date.parse(date)) return '-';
            return locale.format(date, {datePattern: pattern || 'yyyy-MM-dd', selector: "date"});
		},
		
		parse: function(dateStr, pattern) {
			return locale.parse(dateStr, {datePattern: pattern || 'yyyy-MM-dd', selector: 'date'});
		},

        formatStr: function(dateStr, pattern, toPattern) {
            return this.format(this.parse(dateStr, pattern || 'yyyy-MM-dd HH:mm:ss'), toPattern);
        },
	
		difference: function(date1, date2, unit) {
			return date.difference(date1, date2, unit || 'day');
		},
		
		add: function(date1, unit, step) {
            if (unit == 'week') {
                step = step * 7 + 1;
                unit = 'day';
            }
			date1 = date.add(date1, unit, step);
	        date1.setDate(date1.getDate());
			return date1;
		},
		
		today: function() {
			return new Date(this.format(new Date()));
		},

        /**
         * @param hisTime 历史时间戳
         * @param nowTime 当前时间戳
         * @returns {string} 直接显示
         */
        ago: function(hisTime, nowTime) {
            var now =nowTime ? nowTime : new Date().getTime(),
                diffValue = now - hisTime,
                result='',
                minute = 1000 * 60,
                hour = minute * 60,
                day = hour * 24,
                halfamonth = day * 15,
                month = day * 30,
                year = month * 12,

                _year = diffValue/year,
                _month =diffValue/month,
                _week =diffValue/(7*day),
                _day =diffValue/day,
                _hour =diffValue/hour,
                _min =diffValue/minute;

            if(_year>=1) result=parseInt(_year) + "年前";
            else if(_month>=1) result=parseInt(_month) + "个月前";
            else if(_week>=1) result=parseInt(_week) + "周前";
            else if(_day>=1) result=parseInt(_day) +"天前";
            else if(_hour>=1) result=parseInt(_hour) +"个小时前";
            else if(_min>=1) result=parseInt(_min) +"分钟前";
            else result="刚刚";
            return result;
        }
	};
});