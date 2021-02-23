# Sql语句和Mybatis互转工具

## Sql转Mybatis
> 支持批量INSERT,UPDATE,DELETE语句
>
> 支持数字、字符串、IN、BETWEEN、LIKE等常用表达式
> 
> 支持特定特定条件不转换（数值前加#）
> ## 使用事例
> ### Sql语句：
>
> select a from table where b in (select b from dtable where c=1 and d=1 and e in (1,3)) and dd=#12313
>
> 点击【SQL转Mybatis】按钮直接转换为：
>
> ### 转换后的Mybatis语句：
> ```&lt;select id=&quot;getProjectById&quot; resultType=&quot;com.sdk.bo.ProjectBO&quot;&gt;
select a from table where 1=1 AND  b  in (
select b from dtable where 1=1
&lt;if test=&quot;c!=null and c!=&#x27;&#x27;&quot;&gt;
	  AND c=#{c}
&lt;/if&gt;
&lt;if test=&quot;d!=null and d!=&#x27;&#x27;&quot;&gt;
	  and d=#{d}
&lt;/if&gt;
&lt;if test=&quot;eList !=null and eList.size()&gt;0&quot;&gt;
	  and e in 
	&lt;foreach item=&quot;e&quot; index=&quot;index&quot; collection=&quot;eList&quot; open=&quot;(&quot; separator=&quot;,&quot; close=&quot;)&quot;&gt;
		#{e}
	&lt;/foreach&gt;
&lt;/if&gt;
) and dd=12313
&lt;/select&gt;```
> 

## Mybatis转Sql
> ## 使用事例
>
> ### Mybatis语句：
>
> ==>  Preparing: select id, bucket_name, object_key, etag, version_id, creator, created, file_name, file_ext, file_size, updator, updated, enabled, object_url from ability_obs where id = ? 
>
> ==> Parameters: 458898(Long)
>
> 点击【Mybatis转SQL】按钮直接转换为：
>
> ### Sql语句：
>
> select id, bucket_name, object_key, etag, version_id, creator, created, file_name, file_ext, file_size, updator, updated, enabled, object_url from ability_obs where id = 458898
