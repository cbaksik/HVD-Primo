<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:viarecord="http://via.lib.harvard.edu" xmlns:xlink="http://www.w3.org/TR/xlink">
	<xsl:output method="html"/>


	<xsl:template name="VIAGallary" match="/">
		<xsl:for-each select="//image">
			<html>
				<body>
					<div class="VIAThumbnail">
						<xsl:call-template name="thumbnailAndCaption"/>

						<!-- Hidden MetaData that is injected to the FancyBox when it opens -->
						<div class="VIAMetaData">
							<table class="VIAMetaDataTable">
								<xsl:call-template name="workGroupData"/>
							</table>

							<!-- Meta Data for the subworks/surrogates -->
							<xsl:if test="parent::surrogate or parent::subwork">
								<hr class="tableSeperator"/>
								<table class="VIAMetaDataSubTable">
									<xsl:call-template name="subworkSurrogateData"/>
								</table>
							</xsl:if>

							<!-- Link to the record -->
							<table class="VIAMetaDataTable">
								<tr>
									<td colspan="2" class="VIAMetaDataValue" id="VIAbookmarkLink">										
											&gt; <a href="LinkPrintPlaceHolder" target="_blank">View full image and record (use this for printing / bookmarking)</a>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</body>
			</html>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="thumbnailAndCaption">
		<table>

			<!-- Thumbnail image starts here -->
			<tr class="VIAThumbnailImage">
				<td>
					<a class="fancybox fancybox.iframe">
						<xsl:attribute name="href">
							<xsl:value-of select="concat(@xlink:href, '?buttons=Y')" />
						</xsl:attribute>

						<xsl:attribute name="title">
							<xsl:if test="parent::surrogate or parent::subwork">
								<xsl:value-of select="../title/textElement"/>
							</xsl:if>
							<xsl:if test="not(parent::surrogate or parent::subwork)">
								<xsl:value-of select="caption"/>
							</xsl:if>
						</xsl:attribute>
						<div class="VIAThumbnailImageWrapper">
							<img>
								<xsl:attribute name="src">
									<xsl:value-of select="concat(thumbnail/@xlink:href, '?height=150&amp;width=150')" />
								</xsl:attribute>
							</img>
							<xsl:if test="@restrictedImage='true'">
								<img src="../uploaded_files/HVD/lock.png" class="VIARestrictedThumbnail"/>
							</xsl:if>  
						</div>
					</a>
				</td>
			</tr>

			<!-- Caption under the thumbnail image -->
			<tr class="VIAThumbnailCaption">
				<td>
					<span class="VIAThumbnailTitle">
						<xsl:if test="parent::surrogate or parent::subwork">
							<xsl:value-of select="../title/textElement"/>
						</xsl:if>
						<xsl:if test="not(parent::surrogate or parent::subwork)">
							<xsl:value-of select="caption"/>
						</xsl:if>
					</span>
				</td>
			</tr>
		</table>
	</xsl:template>

	<!-- Meta Data for Works and Groups - 3 lines -->
	<xsl:template name="workGroupData">
		<xsl:if test="/work/title/textElement|/group/title/textElement">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Title:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="/work/title/textElement|/group/title/textElement"/>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="../creator/nameElement">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Creator:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="../creator/nameElement"/>
					<xsl:if test="../creator/dates">
												, <xsl:value-of select="../creator/dates"/>, 
					</xsl:if>
					<xsl:if test="../creator/nationality">
												, <xsl:value-of select="../creator/nationality"/>
					</xsl:if>
					<xsl:if test="../creator/role">
												, <xsl:value-of select="../creator/role"/>
					</xsl:if>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="../freeDate">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Date:</strong> 
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="../freeDate"/>
				</td>
			</tr>
		</xsl:if>
	</xsl:template>


	<xsl:template name="subworkSurrogateData">
		<!-- Metadata for subworks/surrogate  -->
		<xsl:if test="parent::surrogate or parent::subwork">
			<tr>
				<td class="VIAMetaDataKey">     
					<strong>Component:</strong>             
				</td>                           
				<td class="VIAMetaDataValue">   
					<xsl:value-of select="../@componentID"/>
				</td>                           
			</tr>
		</xsl:if>
		<xsl:if test="../title/textElement">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Title:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="../title/textElement"/>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="../creator/nameElement">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Creator:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="../creator/nameElement"/>
					<xsl:if test="../creator/dates">
												, <xsl:value-of select="../creator/dates"/>, 
					</xsl:if>
					<xsl:if test="../creator/nationality">
												, <xsl:value-of select="../creator/nationality"/>
					</xsl:if>
					<xsl:if test="../creator/role">
												, <xsl:value-of select="../creator/role"/>
					</xsl:if>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="../workType">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Work Type:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="../workType"/>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="../freeDate">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Date:</strong> 
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="../freeDate"/>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="../topic">            
			<tr>                                    
				<td class="VIAMetaDataKey">                 
					<strong>Topic:</strong>                          
				</td>                                       
				<td class="VIAMetaDataValue">               
					<xsl:for-each select="../topic">
						<xsl:value-of select="term"/>
						<xsl:if test="position()!=last()">;&#160;</xsl:if>
					</xsl:for-each>
				</td>                                       
			</tr> 

		</xsl:if>


		<xsl:if test="../repository/repositoryName">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Repository:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="../repository/repositoryName"/>
				</td>
			</tr>
		</xsl:if>

	</xsl:template>
</xsl:stylesheet>




