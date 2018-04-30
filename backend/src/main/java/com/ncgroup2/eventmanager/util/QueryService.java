package com.ncgroup2.eventmanager.util;

import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
@PropertySource("classpath:queries.properties")
public class QueryService {

    @Resource
    private Environment env;

    public String getQuery(String name) {
        return this.env.getRequiredProperty(name);
    }
}