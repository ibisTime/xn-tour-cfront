package com.hichengdai.qlqq.front.localToken;

import org.springframework.data.redis.connection.RedisConnection;

public interface UserDAO {

    public Object doInRedis(RedisConnection connection);

    public User getUser(String userId);

    public void saveUser(User user);

    /**
     * 通过key删除
     * 
     * @param key
     */
    public abstract long del(String userId);

}
