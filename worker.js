// API 路径
const HOOK_PATH = "/hook";
const UUID = "4e22fa21-3155-4a07-ac86-a767239e0f9a";  
export default {

  async fetch(request, env, ctx) {
    try{
      let url = new URL(request.url);
      let { protocol, hostname, pathname } = url;
        if(pathname.startsWith(HOOK_PATH)&&request.method==='POST'){//处理hook提交
          const body = JSON.parse(await request.text());
          if(body!= undefined&&body!=""){
            await env.webhook.put(
              UUID,JSON.stringify(body)
            );
            return new Response(
              JSON.stringify({ "res": "successful" }),
              {
                headers: { "Content-Type": "application/json; charset=utf-8" },
              }
            );       
          }
        }else{
          let hook_src = await env.webhook.get(UUID);
          if(hook_src!=null){
            if(pathname!=undefined&&pathname!=""&&pathname!="/"){
                hook_src = JSON.parse(hook_src);
                let port = hook_src["port"];
                let target_url = protocol+"//"+pathname.substring(1,pathname.length)+"."+hostname+":"+port;
                return Response.redirect(target_url, 302);
            }else{
                hook_src = JSON.parse(hook_src);
                let port = hook_src["port"];
                let target_url = protocol+"//www."+hostname+":"+port;
                return Response.redirect(target_url, 302);
            }
          }
          return new Response("hook注册信息为空,请稍后再试!",{
            status: 200,
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            }
          });
        } 
      return new Response("请使用存在的二级域名访问!",{
        status: 200,
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      });
    }catch (err) {
        return new Response(err.toString());
      }


  },
};
