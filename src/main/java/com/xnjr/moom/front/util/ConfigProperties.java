package com.xnjr.moom.front.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class ConfigProperties {
    private static Properties props;

    static {
        props = new Properties();
        try {
            props.load(Thread.currentThread().getContextClassLoader()
                .getResourceAsStream("config.properties"));
        } catch (FileNotFoundException e) {
            throw new RuntimeException("找不到config.properties文件", e);
        } catch (IOException e) {
            throw new RuntimeException("读取config.properties文件出错", e);
        }
    }

    public static final class Config {

        public static String SMS_URL = props.getProperty("SMS_URL");

        public static String MALL_URL = props.getProperty("MALL_URL");

        public static String USER_URL = props.getProperty("USER_URL");

        public static String IDENTIFY_URL = props.getProperty("IDENTIFY_URL");

        public static String ACCOUNT_URL = props.getProperty("ACCOUNT_URL");

        // #****** picture server config ******
        public static String URL_PREFIX = props.getProperty("URL_PREFIX");

        public static String HOST = props.getProperty("HOST");

        public static String PORT = props.getProperty("PORT");

        public static String USERNAME = props.getProperty("USERNAME");

        public static String PASSWORD = props.getProperty("PASSWORD");

        public static String PRE_DIR = props.getProperty("PRE_DIR");

        public static String FILE_PRE_DIR = props.getProperty("FILE_PRE_DIR");

        public static String MOBILE_URL = props.getProperty("MOBILE_URL");
    }
}
