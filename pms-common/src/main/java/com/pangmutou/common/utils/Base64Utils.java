package com.pangmutou.common.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

/**
 * 创建日期:2018年1月14日<br/>
 * 创建时间:下午6:50:53<br/>
 * 创建者 :yellowcong<br/>
 * 机能概要:用于Base64解码和编码
 */
public class Base64Utils {

    private static Base64Utils utils = null;

    private Base64Utils(){

    }

    /**
     * 创建日期:2018年1月14日<br/>
     * 创建时间:下午7:23:30<br/>
     * 创建用户:yellowcong<br/>
     * 机能概要:单利 ，懒汉模式
     * @return
     */
    public static Base64Utils getInstance(){
        if(utils == null){
            synchronized (Base64Utils.class) {
                if(utils == null ){
                    utils = new Base64Utils();
                }
            }
        }
        return utils;
    }
    /**
     * 创建日期:2018年1月14日<br/>
     * 创建时间:下午7:47:12<br/>
     * 创建用户:yellowcong<br/>
     * 机能概要:获取文件的大小
     * @param inFile 文件
     * @return 文件的大小
     */
    public int getFileSize(File inFile){
        InputStream in = null;

        try {
            in = new FileInputStream(inFile);
            //文件长度
            int len = in.available();
            return len;
        }catch (Exception e) {
            // TODO: handle exception
        }finally{
            try {
                in.close();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return -1;
    }

    /**
     * 创建日期:2018年1月14日<br/>
     * 创建时间:下午6:57:53<br/>
     * 创建用户:yellowcong<br/>
     * 机能概要:将文件转化为base64
     * @return
     * @throws Exception
     */
    public String file2Base64(File inFile){

        //将文件转化为字节码
        byte [] bytes = copyFile2Byte(inFile);
        if(bytes == null){
            return null;
        }

        //base64,将字节码转化为base64的字符串
        String result = Base64.getEncoder().encodeToString(bytes);
        return result;
    }

    /**
     *
     * 创建日期:2018年1月14日<br/>
     * 创建时间:下午7:09:02<br/>
     * 创建用户:yellowcong<br/>
     * 机能概要:将文件转化为字节码
     * @param inFile
     * @return
     */
    private byte [] copyFile2Byte(File inFile){
        InputStream in = null;

        try {
            in = new FileInputStream(inFile);
            //文件长度
            int len = in.available();

            //定义数组
            byte [] bytes = new byte[len];

            //读取到数组里面
            in.read(bytes);
            return bytes;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }finally{
            try {
                if(in != null){
                    in.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    /**
     * 创建日期:2018年1月14日<br/>
     * 创建时间:下午6:54:02<br/>
     * 创建用户:yellowcong<br/>
     * 机能概要:将字符串转化为文件
     * @param strBase64 base64 编码的文件
     * @param outFile 输出的目标文件地址
     * @return
     * @throws IOException
     */
    public boolean base64ToFile(String strBase64,File outFile){
        try {
            // 解码，然后将字节转换为文件
            byte[] bytes = Base64.getDecoder().decode(strBase64); // 将字符串转换为byte数组
            return copyByte2File(bytes,outFile);
        } catch (Exception ioe) {
            ioe.printStackTrace();
            return false;
        }
    }
    /**
     * 创建日期:2018年1月14日<br/>
     * 创建时间:下午7:01:59<br/>
     * 创建用户:yellowcong<br/>
     * 机能概要:将字节码转化为文件
     * @param bytes
     * @param file
     */
    private boolean copyByte2File(byte [] bytes,File file){
        FileOutputStream  out = null;
        try {
            //转化为输入流
            ByteArrayInputStream in = new ByteArrayInputStream(bytes);

            //写出文件
            byte[] buffer = new byte[1024];

            out = new FileOutputStream(file);

            //写文件
            int len = 0;
            while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len); // 文件写操作
            }
            return true;
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }finally{
            try {
                if(out != null){
                    out.close();
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Base64Utils utils = Base64Utils.getInstance();
        String str = "0M8R4KGxGuEAAAAAAAAAAAAAAAAAAAAAPgADAP7/CQAGAAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAEAAA/v///wAAAAD+////AAAAAAAAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/////v///wMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAD+/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1IAbwBvAHQAIABFAG4AdAByAHkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWAAUA//////////8BAAAAor+86Vi8S0Ko/tKUp+BGVwAAAAAAAAAAAAAAAGC2UDjIKdYB/v///wAAAAAAAAAAQwBvAG4AdABlAG4AdABzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAgH///////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAKxoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALVBJQQAAAAAAAAAAAAAAAAAAAAACAAAAJxoAANMMlYOI9SBL5jm4pEe7LbElpR6vYuoAAAEAjAA2NjYAAAAAAAYYAACVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwYVrAt/AhfPFLKKIGBpqA8EJVP8sUIlssMIldp/r927kO0/gUULvLIAf+ln7AlooM2jrgAUR2GLjiqzr2EGTMLrQ+xPICprIkzvl/oDWExX9OmIIvsf6fmQ7RDr2FeWC63tm+UlBIELhDlI6KHT0sPDVDep4VzfdvLno9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";
        utils.base64ToFile(str, new File("D://xx.aip"));
    }
}


