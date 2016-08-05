package com.xnjr.moom.front.util;

import java.math.RoundingMode;
import java.text.DecimalFormat;

import com.xnjr.moom.front.exception.BizException;

public class AmountUtil {
    // 乘以1000，转化为厘
    public static String s_mult(String number) {
        DecimalFormat df = new DecimalFormat(".00");
        df.setRoundingMode(RoundingMode.FLOOR);
        Double money;
        try {
            String m = df.format(Double.parseDouble(number));
            money = Double.parseDouble(m) * 1000;
        } catch (Exception e) {
            throw new BizException("zc000001", "金额必须是数字类型");
        }
        return String.valueOf(money.longValue());
    }

    public static String s_divi(String number) {
        Long money;
        try {
            money = Long.parseLong(number);
        } catch (Exception e) {
            throw new BizException("zc000001", "金额必须是数字类型");
        }
        return String.valueOf((Long) (money / 1000));
    }

    public static Long mult(Double source) {

        Double d = source * 1000;
        return d.longValue();
    }

    public static Double divi(Long source) {

        Double l = source / 1000.0;
        return l;

    }

    public static void main(String[] args) {

        System.out.println(s_mult("0.0123423424234321"));
    }
}
