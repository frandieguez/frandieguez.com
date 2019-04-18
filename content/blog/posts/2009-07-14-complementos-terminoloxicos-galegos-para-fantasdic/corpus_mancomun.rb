# Fantasdic
# Copyright (C) 2009 Francisco Diéguez souto <fran.dieguez@glug.es>
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
require "iconv"

module Fantasdic
module Source

    class CorpusMancomun < Base
	
	authors ["Fran Diéguez"]
        title  _("Corpus Mancomun")
        description _("Translate words using Corpus Mancomun.")
        license Fantasdic::GPL
        copyright "Copyright (C) 2009 Fran Diéguez"
        disable_search_all_databases true


        URL_HOST = "corpus.mancomun.org"
	URL_PATH = "/xmlrpc/server.php"

        def available_databases
            {
                "0" => "English to Galician",
		"1" => "Galician to English"
            }
        end

        def available_strategies
            { "translate" => "Translate the words." }
        end

        def self.default_strategy
            "translate"
        end

        def define(db, word)
            word_escaped = CGI.escape(word)
            begin               
		xmlrpc_client = XMLRPC::Client.new(URL_HOST, URL_PATH)
                result = xmlrpc_client.call("corpus_search", word_escaped, db.to_i, "")

		output_result = []		
		
		if !result.nil? && result.length > 0

			result["items"].each do |element|

				# Preparing the definition
				defi = Definition.new
		                defi.word = word
		                defi.database = db
		                defi.body = "#{element["path"]}\n - #{Iconv.iconv("ISO8859-1", "UTF-8", element["original"])}\n - #{Iconv.iconv("ISO8859-1", "UTF-8", element["translated"])}"
		                defi.description = available_databases[db] 
				
		                output_result << defi
				
			end
		end
		output_result
            rescue RuntimeError, SocketError, URI::InvalidURIError => e
                raise Source::SourceError, e.to_s
            end
        end
    end

end
end



Fantasdic::Source::Base.register_source(Fantasdic::Source::CorpusMancomun)
