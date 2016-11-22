package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.ICommodityAO;

@Controller
@RequestMapping(value = "/commodity")
public class CommodityController extends BaseController {
	@Autowired
	ICommodityAO commodityAO;
    
    //查询列表产品
    @RequestMapping(value = "/product/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryListProducts(
    		@RequestParam(value = "category", required = false) String category,
    		@RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "companyCode", required = false) String companyCode){
    	return commodityAO.queryListProducts(category, type,
    			name, status, companyCode);
    }
    

    //分页查询产品
    @RequestMapping(value = "/product/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryPageProducts(
    		@RequestParam(value = "category", required = false) String category,
    		@RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "companyCode", required = true) String companyCode,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir){
    	return commodityAO.queryPageProducts(category, type, name, status,
    			companyCode, start, limit, orderColumn, orderDir, location);
    }
    
    //详情查询产品
    @RequestMapping(value = "/product/info", method = RequestMethod.GET)
    @ResponseBody
    public Object queryModel(
    		@RequestParam("code") String code){
    	return commodityAO.queryProduct(code);
    }
    
    //列表查询类别
    @RequestMapping(value = "/category/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryListCategory(
    		@RequestParam(value = "parentCode", required = false) String parentCode,
    		@RequestParam(value = "name", required = false) String name,
    		@RequestParam(value = "companyCode", required = true) String companyCode){
    	return commodityAO.queryListCategory(parentCode, name, companyCode);
    }
}
