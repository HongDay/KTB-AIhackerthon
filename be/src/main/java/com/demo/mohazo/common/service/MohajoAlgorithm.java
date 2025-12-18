package com.demo.mohazo.common.service;


import com.demo.mohazo.works.entity.Works;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MohajoAlgorithm {


    public List<Works>  Classfication(List<Works> worksList) {
        return List.of(new Works());
    }
}
