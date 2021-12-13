package de.jonashackt.vendingmachine.domain;

public class StatusMsg {

    private String msg;
    private String status;

    protected StatusMsg() {
    }

    public StatusMsg(String msg, String status) {
        this.msg = msg;
        this.status = status;
    }

    @Override
    public String toString() {
        return String.format("Status Message[msg=%s, status='%s']", msg, status);
    }

    public String getStatusMsg() {
        return msg;
    }

    public void setStatusMsg(String msg) {
        this.msg = msg;
    }

    public String getStatus() {
        return status;
    }

    public void setStaus(String status) {
        this.status = status;
    }

}
