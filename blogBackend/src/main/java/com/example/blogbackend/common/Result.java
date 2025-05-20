package com.example.blogbackend.common;

import lombok.Data;

/**
 * 通用返回结果类
 * 
 * @param <T> 数据类型
 */
@Data
public class Result<T> {
  private Integer code; // 状态码
  private String message; // 提示信息
  private T data; // 数据
  private boolean success; // 是否成功

  /**
   * 成功返回结果
   * 
   * @param data 数据
   * @param <T>  数据类型
   * @return 返回结果
   */
  public static <T> Result<T> success(T data) {
    Result<T> result = new Result<>();
    result.setCode(200);
    result.setMessage("操作成功");
    result.setData(data);
    result.setSuccess(true);
    return result;
  }

  /**
   * 成功返回结果
   * 
   * @param message 提示信息
   * @param data    数据
   * @param <T>     数据类型
   * @return 返回结果
   */
  public static <T> Result<T> success(String message, T data) {
    Result<T> result = new Result<>();
    result.setCode(200);
    result.setMessage(message);
    result.setData(data);
    result.setSuccess(true);
    return result;
  }

  /**
   * 失败返回结果
   * 
   * @param message 提示信息
   * @param <T>     数据类型
   * @return 返回结果
   */
  public static <T> Result<T> error(String message) {
    Result<T> result = new Result<>();
    result.setCode(500);
    result.setMessage(message);
    result.setSuccess(false);
    return result;
  }

  /**
   * 失败返回结果
   * 
   * @param code    状态码
   * @param message 提示信息
   * @param <T>     数据类型
   * @return 返回结果
   */
  public static <T> Result<T> error(Integer code, String message) {
    Result<T> result = new Result<>();
    result.setCode(code);
    result.setMessage(message);
    result.setSuccess(false);
    return result;
  }
}