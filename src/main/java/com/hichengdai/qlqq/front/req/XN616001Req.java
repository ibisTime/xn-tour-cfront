package com.hichengdai.qlqq.front.req;

import java.util.List;

public class XN616001Req {
	private String code;
	private String title;
	private String cover;
	private String label1;
	private String label2;
	private String label3;
	private String publisher;
	private String isPublish;
	private List<RideImgObj> picList;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCover() {
		return cover;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	public String getLabel1() {
		return label1;
	}

	public void setLabel1(String label1) {
		this.label1 = label1;
	}

	public String getLabel2() {
		return label2;
	}

	public void setLabel2(String label2) {
		this.label2 = label2;
	}

	public String getLabel3() {
		return label3;
	}

	public void setLabel3(String label3) {
		this.label3 = label3;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public String getIsPublish() {
		return isPublish;
	}

	public void setIsPublish(String isPublish) {
		this.isPublish = isPublish;
	}

	public List<RideImgObj> getPicList() {
		return picList;
	}

	public void setPicList(List<RideImgObj> picList) {
		this.picList = picList;
	}

}
