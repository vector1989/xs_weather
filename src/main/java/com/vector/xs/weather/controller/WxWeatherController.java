package com.vector.xs.weather.controller;

import com.vector.xs.weather.constant.Const;
import com.vector.xs.weather.service.ExcelHandlerService;
import com.vector.xs.weather.util.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 天气处理控制器
 *
 * @author vector
 */
@Slf4j
@RestController
@RequestMapping("excel")
public class WxWeatherController {

    @Resource
    private ExcelHandlerService excelHandlerService;

    /**
     * 文件上传
     *
     * @param file
     * @return
     */
    @PostMapping
    public R upload(HttpServletRequest request, @RequestParam("file") MultipartFile file) {

        //调用文件保存
        excelHandlerService.saveFile(file);

        return R.ok();
    }

    /**
     * 文件下载
     */
    @GetMapping
    public void download(HttpServletResponse response) throws IOException {
        // 设置response的Header
        response.setCharacterEncoding("UTF-8");
        //Content-Disposition的作用：告知浏览器以何种方式显示响应返回的文件，用浏览器打开还是以附件的形式下载到本地保存
        //attachment表示以附件方式下载 inline表示在线打开 "Content-Disposition: inline; filename=文件名.mp3"
        // filename表示文件的默认名称，因为网络传输只支持URL编码的相关支付，因此需要将文件名URL编码后进行传输,前端收到后需要反编码才能获取到真正的名称
        response.addHeader("Content-Disposition", "attachment;filename=" + Const.DOWN_FILE_NAME);
        //告知浏览器下载文件
        response.setContentType("application/octet-stream");

        //导出文件
        excelHandlerService.exportExcel(response.getOutputStream());
    }
}
