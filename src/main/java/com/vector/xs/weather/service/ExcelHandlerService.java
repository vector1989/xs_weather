package com.vector.xs.weather.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import com.vector.xs.weather.constant.Const;
import com.vector.xs.weather.exception.BizException;
import com.vector.xs.weather.util.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;
import java.util.Map;

/**
 * Excel文件处理
 *
 * @author vector
 */
@Slf4j
@Service
public class ExcelHandlerService {


    /**
     * 保存文件值服务器上
     *
     * @param file 文件对象
     */
    public void saveFile(MultipartFile file) {

        try {
            file.transferTo(FileUtil.file(Const.SAVE_FILE_NAME));
        } catch (IOException e) {
            log.error("文件上传失败：{}", e.getMessage());
            throw new BizException("文件上传失败");
        }
    }

    /**
     * 导出excel文件
     *
     * @param out 输出流
     */
    public void exportExcel(OutputStream out) {
        File file = FileUtil.file(Const.SAVE_FILE_NAME);
        if(!file.exists()){
            throw new BizException("请先上传Excel文件！");
        }
        //将输入流解析为excel reader对象
        ExcelReader excelReader = ExcelUtil.getReader(file);
        //获取excel中内容
        List<Map<String, Object>> weathers = excelReader.readAll();

        for (Map<String, Object> weather : weathers) {
            String temp = getTemp(weather.get("地区编码") + "");
            weather.put("天气", temp);
        }

        ExcelWriter writer = ExcelUtil.getWriter(true);
        // 一次性写出内容，使用默认样式，强制输出标题
        writer.write(weathers, true);
        //out为OutputStream，需要写出到的目标流
        writer.flush(out);
        // 关闭writer，释放内存
        writer.close();
    }

    /**
     * 获取天气
     *
     * @param areaCode 区划编码
     * @return
     */
    private String getTemp(String areaCode) {
        //构造该区域天气请求地址
        String url = String.format(Const.WEATHER_URL, areaCode);
        //发起http请求
        String resp = HttpUtil.get(url);
        //解析天气数据
        JSONObject weatherObj = JSONUtil.parseObj(resp);
        JSONObject weatherInfo = weatherObj.getJSONObject("weatherinfo");
        log.info("areaCode:{}, resp:{}", areaCode, resp);
        //获取温度信息
        return weatherInfo.getStr("temp");
    }
}
