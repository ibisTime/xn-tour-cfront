部署步骤：
1，eclipse导出war包

2. 本地war包上传至服务器
  scp -P 57652 xn-mall-appms.war root@120.26.222.73:/home

3. 备份原先配置(如果第一次部署，跳过此步骤)
  cd /home/tomcat_SYJ_moom_appms/webapps
  cp ./xn-mall-appms/WEB-INF/classes/application.properties .
  cp ./xn-mall-appms/WEB-INF/classes/config.properties .
  cp ./xn-mall-appms/WEB-INF/classes/redis.properties .
  rm -rf xn-mall-appms.war
  rm -rf xn-mall-appms
  mv /home/xn-mall-appms.war .
  
4. 已备份配置文件放回原处
  mv -f application.properties ./xn-mall-appms/WEB-INF/classes/
  mv -f config.properties ./xn-mall-appms/WEB-INF/classes/
  mv -f redis.properties ./xn-mall-appms/WEB-INF/classes/
  
5. 启停tomcat 
  cd /home/tomcat_SYJ_moom_appms/bin
  ./shutdown.sh
  ./startup.sh


