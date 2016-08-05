package com.xnjr.moom.front.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtil {

    /**
     * @Fields DATE_FORMAT_STRING : (数据库返回时间格式)
     */
    public static final String DB_DATE_FORMAT_STRING = "yyyyMMdd";

    /**
     * @Fields DISPLAY_DATE_FORMAT_STRING : (前台显示时间格式)
     */
    public static final String FRONT_DATE_FORMAT_STRING = "yyyy-MM-dd";

    /**
     * @Fields DATA_TIME_PATTERN : 日期格式
     */
    public static final String DATA_TIME_PATTERN_1 = "yyyy-MM-dd HH:mm:ss";

    public static final String DATA_TIME_PATTERN_2 = "yyyy-MM-dd HH:mm";

    public static final String DATA_TIME_PATTERN_3 = "yyyyMMDDhhmmss";

    public static final String TIME_BEGIN = " 00:00:00";

    public static final String TIME_END = " 23:59:59";;

    public static Date getRelativeDate(Date startDate, int second) {
        Calendar calendar = Calendar.getInstance();
        try {
            calendar.setTime(startDate);
            calendar.add(Calendar.SECOND, second);
            return calendar.getTime();
        } catch (Exception e) {
            return startDate;
        }
    }

    public static void main(String[] args) {
        System.out.println(getRelativeDate(new Date(), 120));
    }

    /** 
     * Date按格式pattern转String
     * @param date
     * @param pattern
     * @return 
     * @create: 2015-4-18 下午11:02:34 miyb
     * @history: 
     */
    public static String dateToStr(Date date, String pattern) {
        String str = null;
        SimpleDateFormat formater = new SimpleDateFormat(pattern);
        try {
            str = formater.format(date);
        } catch (Exception e) {
        }
        return str;
    }

    /** 
     * 获取当天开始时间
     * @return 
     * @create: 2014-10-14 下午4:24:57 miyb
     * @history: 
     */
    public static Date getTodayStart() {
        Calendar currentDate = new GregorianCalendar();
        currentDate.set(Calendar.HOUR_OF_DAY, 0);
        currentDate.set(Calendar.MINUTE, 0);
        currentDate.set(Calendar.SECOND, 0);
        return (Date) currentDate.getTime().clone();
    }

    /** 
     * 获取当天结束时间
     * @return 
     * @create: 2014-10-14 下午4:24:57 miyb
     * @history: 
     */
    public static Date getTodayEnd() {
        Calendar currentDate = new GregorianCalendar();
        currentDate.set(Calendar.HOUR_OF_DAY, 23);
        currentDate.set(Calendar.MINUTE, 59);
        currentDate.set(Calendar.SECOND, 59);
        return (Date) currentDate.getTime().clone();
    }

    /** 
     * String 按格式pattern转Date
     * @param str
     * @param pattern
     * @return 
     * @create: 2015-4-18 下午11:02:34 miyb
     * @history: 
     */
    public static Date strToDate(String str, String pattern) {
        Date date = null;
        SimpleDateFormat formater = new SimpleDateFormat(pattern);
        try {
            date = formater.parse(str);
        } catch (Exception e) {
        }
        return date;
    }

    /**
     * 按格式获取当前时间
     * @param pattern
     * @return 
     * @create: 2015-5-7 上午11:22:04 miyb
     * @history:
     */
    public static String getToday(String pattern) {
        SimpleDateFormat df = new SimpleDateFormat(pattern);
        return df.format(new Date());
    }

    /**
     * 
     * @param date
     * @param addOneDay 是否加1天
     * @return 
     * @create: 2015-5-7 上午11:25:23 miyb
     * @history:
     */
    public static Date getFrontDate(String date, boolean addOneDay) {
        Date returnDate = null;
        try {
            returnDate = new SimpleDateFormat(FRONT_DATE_FORMAT_STRING)
                .parse(date);
            if (addOneDay) {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(returnDate);
                calendar.add(calendar.DATE, 1);// 把日期往后增加一天.整数往后推,负数往前移动
                returnDate = calendar.getTime(); // 这个时间就是日期往后推一天的结果
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnDate;
    }
}
