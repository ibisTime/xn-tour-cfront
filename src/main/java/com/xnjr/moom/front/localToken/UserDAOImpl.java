package com.xnjr.moom.front.localToken;

import java.io.Serializable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserDAOImpl<T> implements UserDAO {

    @Autowired
    protected RedisTemplate<Serializable, Serializable> redisTemplate;

    public void saveUser(final User user) {
        redisTemplate.execute(new RedisCallback<Object>() {

            @Override
            public Object doInRedis(RedisConnection connection)
                    throws DataAccessException {
                connection.set(
                    redisTemplate.getStringSerializer().serialize(
                        "user.uid." + user.getUserId()), redisTemplate
                        .getStringSerializer().serialize(user.getTokenId()));
                return null;
            }
        });
    }

    @Override
    public User getUser(final String userId) {
        return redisTemplate.execute(new RedisCallback<User>() {
            @Override
            public User doInRedis(RedisConnection connection)
                    throws DataAccessException {
                byte[] key = redisTemplate.getStringSerializer().serialize(
                    "user.uid." + userId);
                if (connection.exists(key)) {
                    byte[] value = connection.get(key);
                    String tokenId = redisTemplate.getStringSerializer()
                        .deserialize(value);
                    User user = new User();
                    user.setTokenId(tokenId);
                    user.setUserId(userId);
                    return user;
                }
                return null;
            }
        });
    }

    /**
     * @param key
     */
    @Override
    public long del(final String userId) {
        return redisTemplate.execute(new RedisCallback<Long>() {
            @Override
            public Long doInRedis(RedisConnection connection)
                    throws DataAccessException {
                long result = 0;
                byte[] key = redisTemplate.getStringSerializer().serialize(
                    "user.uid." + userId);
                if (connection.exists(key)) {
                    result = connection.del(key);
                    return result;
                }
                return result;
            }
        });
    }

    @Override
    public Object doInRedis(RedisConnection connection) {
        // TODO Auto-generated method stub
        return null;
    }

}
