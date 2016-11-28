# require 'C:/Users/Shashank Pavan/Desktop/CloudComputing-Assignment-1/app/controllers/server_side.rb'
require File.expand_path(".") + '/app/controllers/server_side.rb'
require 'faraday_middleware/aws_signers_v4'
require 'elasticsearch'
class MessagingController < ApplicationController
  include ActionController::Live

  def index
  end
  def stream
    response.headers['Content-Type'] = 'text/event-stream'
    sse = ServerSide::SSE.new(response.stream)
    client          = Elasticsearch::Client.new(url: '') do |f|
                      f.request :aws_signers_v4,
                        credentials: Aws::Credentials.new( '', '' ),
                        service_name: 'es',
                        region: 'us-west-2'
                      end  
    begin
	  	elasticsearch   = client.search({from: 0, size: 10000, index: 'surajtest', body: {query: {match: {flag: 1}}}})["hits"]["hits"]
	  	if elasticsearch.length > 0
	  		sse.write("A new query has been added")
	  		elasticsearch.each do |es|
				if es["_source"]["flag"] == 1
					client.update index: 'surajtest', type: 'surajtest', id: es["_id"], body: {doc: {flag: 0}}
				end
		  	end
	  	else
	        sse.write("")
	    end
    rescue IOError
    ensure
      sse.close
    end
  end
end