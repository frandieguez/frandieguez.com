# Fantasdic
# Copyright (C) 2006 - 2007 Francisco Diéguez Souto <fran.dieguez@glug.es>
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

require "open-uri"
require "cgi"
require "xmlrpc/client"


module Fantasdic
module Source

    class OpenTran < Base
        authors ["Fran Diéguez"]
        title  _("Open-Tran.eu")
        description _("Translate words using Open-tran.eu.")
        license Fantasdic::GPL
        copyright "Copyright (C) 2009 Fran Diéguez"
        disable_search_all_databases true
        
        
        # This hash sets all the languages available
        # with  it available_languages will be builded

		#TODO The complete hash with more than 50 languages
		# causes the ralentization of all the GUI.
        BASE_LANGUAGES = {
			"br" => "Brezhoneg",
			"ca" => "Català",
			"ca_valencia" => "Valencià, Català",
			"de" => "Deutsch",
			"en" => "English",
			"en_gb" => "English",
			"eo" => "Esperanto",
			"es" => "Español",
			"eu" => "Euskara",
			"fr" => "Français",
			"ga" => "Gaeilge",
			"gl" => "Galego",
			"it" => "Italiano",
			"nl" => "Nederlands",
			"pt" => "Português",
			"pt_br" => "Português do Brazil"
								}
			    
        URL_HOST = "open-tran.eu"
        URL_PATH = "/RPC2"


		def initialize(*args)
				@@output_languages = Hash.new
					
				BASE_LANGUAGES.each do |lang_code1, lang_human1|
					   
					BASE_LANGUAGES.each do |lang_code2, lang_human2| 

						@@output_languages["#{lang_code1}|#{lang_code2}"] = 
						    "#{lang_human1} to #{lang_human2}" unless (lang_code1 == lang_code2)
						
					end
		
				end
			super(*args)
		end

        def available_databases
            
            @@output_languages
            
        end

        def available_strategies
            { "translate" => "Translate the words." }
        end

        def self.default_strategy
            "translate"
        end

        def define(db, word)
            db_escaped, word_escaped = CGI.escape(db), CGI.escape(word)
            begin               
				lang1, lang2 = db.split("|")

				# Construct the xmlrpc client and prepare the requrest
				xmlrpc_client = XMLRPC::Client.new(URL_HOST, URL_PATH)
		        result = xmlrpc_client.call("suggest2", word_escaped, lang1, lang2)

				output_result = []		
		
				if !result.nil? && result.length >0
				
					# Foreach translation we construct a definition and push it on an array
					result.each do |element|
						defi = Definition.new
						        defi.word = word
						        defi.database = db
						        defi.body = element["projects"][0]["orig_phrase"] + "\n" + element["text"]
						        defi.description = available_databases[db] 
						        output_result << defi
					end
				
				end
				
				# All was correct so returns the complete array
				output_result
		
            rescue SocketError, URI::InvalidURIError => e
                raise Source::SourceError, e.to_s
            end
        end
    end

end
end

Fantasdic::Source::Base.register_source(Fantasdic::Source::OpenTran)
