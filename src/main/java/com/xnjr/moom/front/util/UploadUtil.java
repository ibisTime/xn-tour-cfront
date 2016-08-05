package com.xnjr.moom.front.util;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.codec.binary.Base64;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.xnjr.moom.front.exception.BizException;

/** 
 * SFTP远程连接服务器，上传文件工具类
 * @author: haiqingzheng 
 * @since: 2015年10月20日 下午1:52:17 
 * @history:
 */
public class UploadUtil {

    /** 
     * @param args 
     * @create: 2015年10月20日 下午1:52:17 haiqingzheng
     * @history: 
     */
    public static void main(String[] args) {
        System.out
            .println(uploadPicture("data:image/png;base64,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"));
    }

    /**
     * 文件上传
     * @param filePath 文件本地路径
     * @return 
     * @create: 2016年1月25日 下午4:00:59 haiqingzheng
     * @history:
     */
    public static String uploadFile(String filePath) {

        String path = null;

        String urlPrefix = ConfigProperties.Config.URL_PREFIX;
        String host = ConfigProperties.Config.HOST;
        int port = Integer.valueOf(ConfigProperties.Config.PORT);
        String username = ConfigProperties.Config.USERNAME;
        String password = ConfigProperties.Config.PASSWORD;
        String filePreDir = ConfigProperties.Config.PRE_DIR;

        ChannelSftp sftp = null;
        Channel channel = null;
        Session sshSession = null;

        try {
            // SFTP远程连接服务器
            JSch jsch = new JSch();
            jsch.getSession(username, host, port);
            sshSession = jsch.getSession(username, host, port);
            sshSession.setPassword(password);
            Properties sshConfig = new Properties();
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.connect();
            channel = sshSession.openChannel("sftp");
            channel.connect();
            sftp = (ChannelSftp) channel;

            BufferedInputStream fis = new BufferedInputStream(
                new FileInputStream(filePath));

            // 创建时间目录和随机文件名
            SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHH");
            String date = dateformat.format(new Date());
            String dir = filePreDir + date;

            // 通过文件路径解析文件名
            String fileName = "";
            int index = filePath.lastIndexOf("/");
            if (index != -1 && index > 0) {
                fileName = filePath.substring(index + 1, filePath.length());
            } else {
                throw new BizException("XN000000", "文件路径格式不正确");
            }

            String dstString = dir + "/" + fileName;

            // 判断目录是否存在，不存在则创建新目录
            try {
                sftp.ls(dir);
            } catch (SftpException e) {
                sftp.mkdir(dir);
            }
            sftp.put(fis, dstString);
            path = urlPrefix + date + "/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeChannel(sftp);
            closeChannel(channel);
            closeSession(sshSession);
        }

        return path;
    }

    /**
     * 图片上传
     * @param base64String
     * @return 
     * @create: 2016年1月25日 下午4:00:52 haiqingzheng
     * @history:
     */
    public static String uploadPicture(String base64String) {
        // 参数检测
        Pattern pattern = Pattern.compile("data:image/(.+?);base64");
        Matcher matcher = pattern.matcher(base64String);
        if (!matcher.find()) {
            System.out.println("请传入正确的base64编码格式的图片");
            return null;
        }
        // 取得图片后缀名
        String suffix = matcher.group(1);

        String path = null;

        String urlPrefix = ConfigProperties.Config.URL_PREFIX;
        String host = ConfigProperties.Config.HOST;
        int port = Integer.valueOf(ConfigProperties.Config.PORT);
        String username = ConfigProperties.Config.USERNAME;
        String password = ConfigProperties.Config.PASSWORD;
        String filePreDir = ConfigProperties.Config.PRE_DIR;

        ChannelSftp sftp = null;
        Channel channel = null;
        Session sshSession = null;

        try {
            // SFTP远程连接图片服务器
            JSch jsch = new JSch();
            jsch.getSession(username, host, port);
            sshSession = jsch.getSession(username, host, port);
            sshSession.setPassword(password);
            Properties sshConfig = new Properties();
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.connect();
            channel = sshSession.openChannel("sftp");
            channel.connect();
            sftp = (ChannelSftp) channel;

            // 将base64编码的图片转化成二进制流
            String header = "data:image/" + suffix + ";base64,";
            base64String = base64String.substring(header.length());
            byte[] decoderBytes = Base64.decodeBase64(base64String);
            ByteArrayInputStream fis = new ByteArrayInputStream(decoderBytes);

            // 创建时间目录和随机文件名
            SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHH");
            String date = dateformat.format(new Date());
            String dir = filePreDir + date;
            String picName = generate()
                    + "."
                    + ("jpeg".equalsIgnoreCase(suffix) ? "jpg" : suffix
                        .toLowerCase());
            String dstString = dir + "/" + picName;

            // 判断目录是否存在，不存在则创建新目录
            try {
                sftp.ls(dir);
            } catch (SftpException e) {
                sftp.mkdir(dir);
            }
            sftp.put(fis, dstString);
            path = urlPrefix + date + "/" + picName;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeChannel(sftp);
            closeChannel(channel);
            closeSession(sshSession);
        }

        return path;
    }

    private static void closeChannel(Channel channel) {
        if (channel != null) {
            if (channel.isConnected()) {
                channel.disconnect();
            }
        }
    }

    private static void closeSession(Session session) {
        if (session != null) {
            if (session.isConnected()) {
                session.disconnect();
            }
        }
    }

    /**
     * 根据当前时间生成一个随机数
     * @return 
     * @create: 2015年10月22日 上午10:57:25 haiqingzheng
     * @history:
     */
    public static String generate() {
        int random = Math.abs(new Random().nextInt()) % 100000000;
        String today = dateToStr(new Date(), "yyyyMMDDhhmmss")
                + String.valueOf(random);
        return today;
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
}
