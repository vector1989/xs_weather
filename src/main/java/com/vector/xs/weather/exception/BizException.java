package com.vector.xs.weather.exception;

/**
 *
 * @author vector
 */
public class BizException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public BizException(String message) {
        super(message);
    }

    public BizException(Throwable cause) {
        super(cause);
    }

    public BizException(String message, Throwable cause) {
        super(message, cause);
    }
}
